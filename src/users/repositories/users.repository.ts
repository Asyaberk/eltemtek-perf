import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
//prepare imports for file upload 
import * as XLSX from 'xlsx';
import { DepartmentRepository, RolesRepository, SeflikRepository, TesisRepository, MudurlukRepository } from 'libs/organisation/src';


@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly departmentRepo: DepartmentRepository,
    private readonly roleRepo: RolesRepository,
    private readonly tesisRepo: TesisRepository,
    private readonly seflikRepo: SeflikRepository,
    private readonly mudurlukRepo: MudurlukRepository,
  ) {}

  async find(): Promise<User[]> {
    return this.userRepo.find({
      select: ['id', 'sicil_no', 'first_last_name'],
      relations: ['role', 'department', 'tesis', 'seflik', 'mudurluk'],
      order: { first_last_name: 'ASC' },
    });
  }

  //sicil idye göre YAPIALACAK
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role', 'department', 'tesis', 'seflik', 'mudurluk'],
    });
    if (!user) throw new NotFoundException(`User with ID '${id}' not found.`);
    return user;
  }

  async findOneBySicilNo(sicil_no: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { sicil_no },
      relations: ['role', 'department', 'tesis', 'seflik', 'mudurluk'],
    });
  }

  async save(user: Partial<User>): Promise<User> {
    const entity = this.userRepo.create(user);
    return this.userRepo.save(entity);
  }

  //file upload tek seferlik endpointsiz
  async importFromExcel(filePath: string): Promise<User[]> {
    const workbook = XLSX.readFile(filePath); // ✅ artık buffer değil, dosya yolu
    const sheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json<any>(workbook.Sheets[sheetName]);

    const entities: Partial<User>[] = [];

    for (const row of worksheet) {
      const department =
        (await this.departmentRepo.findByName(row['Bölümü'])) || undefined;
      const role = (await this.roleRepo.findByName(row['Görev'])) || undefined;
      const tesis = row['Tesis']
        ? (await this.tesisRepo.findByName(row['Tesis'])) || undefined
        : undefined;
      const seflik = row['Şeflik']
        ? (await this.seflikRepo.findByName(row['Şeflik'])) || undefined
        : undefined;
      const mudurluk = row['Müdürlük']
        ? (await this.mudurlukRepo.findByName(row['Müdürlük'])) || undefined
        : undefined;

      entities.push({
        sicil_no: String(row['Sicil No']).trim(),
        first_last_name: String(row['Adı Soyadı']).trim(),
        department,
        role,
        tesis,
        seflik,
        mudurluk,
      });
    }

    const createdEntities = this.userRepo.create(entities);
    return this.userRepo.save(createdEntities);
  }

  async deleteById(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}