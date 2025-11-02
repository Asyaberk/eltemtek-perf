import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import * as XLSX from 'xlsx';

// Gerekli tüm repoları ve entity'leri import ediyoruz
import {
  DepartmentRepository,
  RolesRepository,
  SeflikRepository,
  TesisRepository,
  MudurlukRepository
} from 'libs/organisation/src';

import { differenceInMonths, parseISO } from 'date-fns';

// Excel'den gelen ham veriyi tanımlamak için dâhili bir tip
type RawUserRow = {
  [key: string]: any;
};

@Injectable()
export class UserRepository {
  //Hatalar içimn ayıklama ve loglar
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly departmentRepo: DepartmentRepository,
    private readonly roleRepo: RolesRepository,
    private readonly tesisRepo: TesisRepository,
    private readonly seflikRepo: SeflikRepository,
    private readonly mudurlukRepo: MudurlukRepository,
  ) {}

  //bu silinecek sadece users listesi üst üste geldiği için geçici metod
  async clearAllUsers(): Promise<void> {
    await this.userRepo.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
  }
  //sicilnumarasını yeni exceldeki gibi 5 basamaklı yapmak, başına 0 ekleyerek
  private padSicilNo(sicil: string | number): string {
    const s = String(sicil);
    return s.padStart(5, '0');
  }

  async find(): Promise<User[]> {
    return this.userRepo.find({
      select: ['id', 'sicil_no', 'first_last_name', 'hireDate'],
      relations: [
        'role',
        'department',
        'tesis',
        'seflik',
        'mudurluk',
        'evaluatedBy',
      ],
      order: { first_last_name: 'ASC' },
    });
  }

  async findOneBySicilNo(sicil_no: string): Promise<User> {
    const normalizedSicilNo = this.padSicilNo(sicil_no);

    const user = await this.userRepo.findOne({
      where: { sicil_no: normalizedSicilNo },
      relations: [
        'role',
        'department',
        'tesis',
        'seflik',
        'mudurluk',
        'evaluatedBy',
      ],
    });
    if (!user)
      throw new NotFoundException(`User with ID '${sicil_no}' not found.`);
    return user;
  }

  async save(user: Partial<User>): Promise<User> {
    // Sicil No'yu DB'ye kaydetmeden önce 5 basamağa tamamla
    if (user.sicil_no) {
      user.sicil_no = this.padSicilNo(user.sicil_no);
    }
    const entity = this.userRepo.create(user);
    return this.userRepo.save(entity);
  }

  async deleteById(sicil_no: string): Promise<void> {
    await this.userRepo.delete(sicil_no);
  }

  // yapay zeka yardımı çünkü yapamadım
  // ------------------------------------------------------------------
  // METOT: importAndMergeExcelData (İKİ EXCEL DOSYASINI BİRLEŞTİRİR)
  // ------------------------------------------------------------------
  async importAndMergeExcelData(
    oldFilePath: string,
    newFilePath: string,
  ): Promise<{ total: number; upserted: number; linked: number }> {
    const normalizeSicil = (
      sicil: string | number | undefined,
    ): string | null => {
      if (!sicil) return null;
      const num = Number(String(sicil).trim());
      // 5 basamağa tamamlayarak normalize et
      return Number.isNaN(num) ? null : this.padSicilNo(num);
    };

    // ÖN HAZIRLIK: İlişkisel Veri Map'lerini Yükleme
    this.logger.log(
      'İlişkisel veriler (Departman, Rol, Tesis vb.) yükleniyor...',
    );
    const [allDepartments, allRoles, allTesis, allSefliks, allMudurluks] =
      await Promise.all([
        this.departmentRepo.find(),
        this.roleRepo.find(),
        this.tesisRepo.find(),
        this.seflikRepo.find(),
        this.mudurlukRepo.find(),
      ]);

    // Map<İsim, Entity>
    const deptMap = new Map(
      allDepartments.map((d) => [d.department_name.trim(), d]),
    );
    const roleMap = new Map(allRoles.map((r) => [r.name.trim(), r]));
    const tesisMap = new Map(allTesis.map((t) => [t.tesis_name.trim(), t]));
    const seflikMap = new Map(allSefliks.map((s) => [s.seflik_name.trim(), s]));
    const mudurlukMap = new Map(
      allMudurluks.map((m) => [m.mudurluk_name.trim(), m]),
    );

    // ------------------------------------------------------------------
    // AŞAMA 1: VERİ BİRLEŞTİRME VE UPSERT
    // ------------------------------------------------------------------
    this.logger.log('Aşama 1: Excel verileri birleştiriliyor...');

    // ADIM 1.1: Eski Excel'i Oku
    const oldWb = XLSX.readFile(oldFilePath);
    const oldSheet = XLSX.utils.sheet_to_json<RawUserRow>(
      oldWb.Sheets[oldWb.SheetNames[0]],
    );
    const oldMap = new Map<string, Partial<User>>();
    for (const row of oldSheet) {
      const normSicil = normalizeSicil(row['Sicil No']); // 5 basamaklı
      if (!normSicil) continue;

      oldMap.set(normSicil, {
        sicil_no: normSicil, // 5 basamaklı sicil no'yu sakla
        first_last_name: row['Adı Soyadı']?.trim(),
        department: deptMap.get(row['Bölümü']?.trim()) || undefined,
        role: roleMap.get(row['Görev']?.trim()) || undefined,
        tesis: tesisMap.get(row['Tesis']?.trim()) || undefined,
        seflik: seflikMap.get(row['Şeflik']?.trim()) || undefined,
        mudurluk: mudurlukMap.get(row['Müdürlük']?.trim()) || undefined,
      });
    }
    this.logger.log(`Eski Excel'den ${oldMap.size} kayıt önbelleğe alındı.`);

    // ADIM 1.2: Yeni Excel'i Oku ve ESKİ VERİYLE BİRLEŞTİR
    const newWb = XLSX.readFile(newFilePath);
    const newSheet = XLSX.utils.sheet_to_json<RawUserRow>(
      newWb.Sheets[newWb.SheetNames[0]],
    );

    const evaluatorNameMap = new Map<string, string>();
    const usersToUpsert: Partial<User>[] = [];

    for (const row of newSheet) {
      const normSicil = normalizeSicil(row['Sicil No']); // 5 basamaklı
      if (!normSicil) continue;

      const oldData = oldMap.get(normSicil) || {};

      // Tarih (HireDate) işle
      let hireDate: Date | undefined;
      if (typeof row['Kıdem Tarihi'] === 'number') {
        const excelDateObj = XLSX.SSF.parse_date_code(row['Kıdem Tarihi']);
        hireDate = new Date(
          Date.UTC(excelDateObj.y, excelDateObj.m - 1, excelDateObj.d),
        );
      } else if (typeof row['Kıdem Tarihi'] === 'string') {
        hireDate = parseISO(row['Kıdem Tarihi']);
      } else {
        hireDate = undefined;
      }

      const evaluatorName = row['Değerlendiren Yöneticisi']?.trim();
      if (evaluatorName) {
        evaluatorNameMap.set(normSicil, evaluatorName);
      }

      // BİRLEŞTİRME: Yeni veriler eski veriyi ezer.
      usersToUpsert.push({
        ...oldData,
        sicil_no: normSicil, // 5 basamaklı sicil no'yu sakla
        first_last_name: row['Adı Soyadı']?.trim() || oldData.first_last_name,

        department: deptMap.get(row['Bölümü']?.trim()) || oldData.department,
        role: roleMap.get(row['Görev']?.trim()) || oldData.role,
        tesis: tesisMap.get(row['Tesis']?.trim()) || oldData.tesis,
        hireDate: hireDate,
      });
    }

    // ADIM 1.3: Toplu UPSERT
    this.logger.log(
      `Aşama 1: ${usersToUpsert.length} kullanıcı veritabanına işleniyor (Upsert)...`,
    );
    const upsertResult = await this.userRepo.upsert(usersToUpsert, {
      conflictPaths: ['sicil_no'],
      skipUpdateIfNoValuesChanged: true,
    });

    // ------------------------------------------------------------------
    // AŞAMA 2: YÖNETİCİ İLİŞKİLERİNİ SİCİL NO İLE KURMA
    // ------------------------------------------------------------------
    this.logger.log('Aşama 2: Yönetici (Evaluator) ilişkileri kuruluyor...');

    // ADIM 2.1: Upsert edilen tüm kullanıcıları DB'den çek (Sicil No, İsim ve hireDate için)
    const allUsers = await this.userRepo.find({
      select: ['sicil_no', 'first_last_name', 'hireDate'],
    });

    // Map<İsim, 5-Basamaklı Sicil No> (Yönetici adını Sicil No'ya çevirmek için)
    const sicilByNameMap = new Map<string, string>();
    // Map<5-Basamaklı Sicil No, Employee Objeleri>
    const employeeBySicilMap = new Map<string, User>();
    for (const user of allUsers) {
      sicilByNameMap.set(user.first_last_name.trim(), user.sicil_no);
      employeeBySicilMap.set(user.sicil_no, user);
    }

    // ADIM 2.2: İlişkileri ve İş Kuralı (BR1) uygula
    const today = new Date();
    const CUTOFF_MONTHS = 2;
    const updatesToRun: Promise<any>[] = [];

    for (const [employeeSicil, evaluatorName] of evaluatorNameMap.entries()) {
      const employee = employeeBySicilMap.get(employeeSicil);
      const evaluatorSicil = sicilByNameMap.get(evaluatorName); // Yönetici Adı -> 5-Basamaklı Sicil No

      // Yönetici sicil no'su sadece isimle eşleştiği için, kullanıcı DB'de yoksa atla
      if (!employee || !evaluatorSicil) continue;

      const isEligible = employee.hireDate
        ? differenceInMonths(today, employee.hireDate) >= CUTOFF_MONTHS
        : true;

      // Başlangıç: İlişkiyi temizle (null yap)
      let evaluatedByUpdate: User | null = null;

      if (isEligible) {
        // İLİŞKİYİ KUR: evaluatedBy ilişkisine, sadece sicil_no'su olan bir User objesi gönder.
        // TypeORM, Entity'deki JoinColumn tanımını kullanarak bu sicil_no'yu evaluator_sicil_no sütununa yazar.
        evaluatedByUpdate = { sicil_no: evaluatorSicil } as User;
      }

      updatesToRun.push(
        // sicil_no benzersiz olduğu için güncelleme koşulu olarak kullanılabilir
        this.userRepo.update(
          { sicil_no: employeeSicil },
          { evaluatedBy: evaluatedByUpdate },
        ),
      );
    }

    await Promise.all(updatesToRun);
    this.logger.log(
      `Aşama 2: ${updatesToRun.length} ilişki işlemi tamamlandı.`,
    );

    return {
      total: usersToUpsert.length,
      upserted: upsertResult.identifiers.length,
      linked: updatesToRun.length,
    };
  }

  // ------------------------------------------------------------------
  // YENİ METOT: Evaluator'a Bağlı Çalışanları Getir (BR2 Query)
  // ------------------------------------------------------------------
  async findEvaluatedEmployeesByEvaluatorId(
    evaluatorSicilNo: string,
  ): Promise<User[]> {
    // Controller'dan gelen sicil no'yu 5 basamağa tamamla
    const normalizedSicilNo = this.padSicilNo(evaluatorSicilNo);

    // evaluatedBy ilişkisinin Foreign Key sütun adı 'evaluator_sicil_no' oldu.
    return this.userRepo
      .createQueryBuilder('employee')
      .where('employee.evaluator_sicil_no = :sicil', {
        sicil: normalizedSicilNo,
      })
      .select([
        'employee.id',
        'employee.sicil_no',
        'employee.first_last_name',
        'employee.hireDate',
      ])
      .getMany();
  }
}