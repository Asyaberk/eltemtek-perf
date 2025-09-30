//this will be e2e test for auth module run npm test:e2e:watch
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
//DATASOURCE KULLANACAĞIM ÇÜNKÜ REGİSTER TESTİNDE UNIQUE EMAİL GEREKİYOR
//VE HER TEST ÇALIŞTIĞINDA YENİ UNİQUE OLUŞTURUYOR VE ESKİSİNİ DE DBYE KAYDEDİYOR
//DB ÇOK ŞİŞECEK BU YÜZDEN ÇARE OLARAK TRANSACTION, TURNCATE YA DA AYRI BİR TEST DB OLUŞTURMAKTANSA(şu anlık çok komplike)  
//SQL DELETE QUERY KULLANMAYI DENEYECEĞİM
import { DataSource } from 'typeorm';

describe('AuthController (e2e)', () => {
    let app: INestApplication<App>;
    let dataSource: DataSource;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init(); 

        //bir tane query runner oluştur
        dataSource = moduleFixture.get(DataSource);
    });

    //Her testten sonra test kullanıcılarını temizle
    afterEach(async () => {
        await dataSource.query(`DELETE FROM "user" WHERE email LIKE 'e2e_%@mail.com'`);
    });

    afterAll(async () => {
        await dataSource.destroy();
        await app.close();
    });

    //i wont write e2e test for user and role modules, its only test is here
    describe('/users (GET)', () => {
        it('can return a list of all users', async () => {
            const result = await request(app.getHttpServer())
                .get('/users')
                .expect(200);
            expect(result.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ email: 'user@mail.com' }),
                ]),
            );
        });
    });

    describe('/roles (GET)', () => {
        it('can return a list of all roles', async () => {
            const result = await request(app.getHttpServer())
                .get('/roles')
                .expect(200);
            expect(result.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: 'admin' }),
                ]),
            );
        });
    });

    describe('/auth/register (POST)', () => {
        it('can create a new user', async () => {
            //we should create a uniqe email because we are dealing with real db and for register func 
            //we should use unused mail, otherwise it will throw error
            const uniqueEmail = `e2e_${Date.now()}@mail.com`;
            const dto = { email: uniqueEmail, password: '1234', roleId: 1 };
        
            const result = await request(app.getHttpServer())
                .post('/auth/register')
                .send(dto)
                .expect(201)
        
            expect(result.body.user.email).toBe(dto.email);
            expect(result.body.userToken).toBeDefined();
        });
        
        it('can return 400 if email is already taken', async () => {
            const duplicatedEmail = `e2e_${Date.now()}@mail.com`;
            const dto = { email: duplicatedEmail, password: '1234', roleId: 1 };

            //create a user same way like register test
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(dto)
                .expect(201);

            //then try to create with the same email
            const result = await request(app.getHttpServer())
                .post('/auth/register')
                .send(dto)
                .expect(400);

            expect(result.body.message).toMatch(/already registered!/i);
        });
    });

    describe('/auth/login (POST)', () => {
        it('can login an user', async () => {
            const loginEmail = `e2e_${Date.now()}@mail.com`;
            const dto = { email: loginEmail, password: '1234', roleId: 1 };

            //create a user same way like register test
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(dto)
                .expect(201);
            
            //then login
            const result = await request(app.getHttpServer())
                .post('/auth/login')
                .send(dto)
                .expect(200)

            expect(result.body.user.email).toBe(loginEmail);
            expect(result.body.message).toMatch(/logged in!/i);
        });

        it('can return 401 if email is not found', async () => {
            const result = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'unusedMail@mail.com', password: '1234' })
                .expect(401);
            
            expect(result.body.message).toMatch(/No account found with this email!/i);
        });

        it('can return 401 if password is incorrect', async () => {
            const loginEmail = `e2e_${Date.now()}@mail.com`;
            const dto = { email: loginEmail, password: 'correct', roleId: 1 };
            
            //create a user same way like register test
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(dto)
                .expect(201);

            //then try login with unused mail
            const result = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: loginEmail, password: 'wrong' })
                .expect(401);
            
            expect(result.body.message).toMatch(/Password is incorrect!/i);
        });
    });

    describe('/auth/logout (POST)', () => {
        it('can logout a user', async () => {
            const loginEmail = `e2e_${Date.now()}@mail.com`;
            const dto = { email: loginEmail, password: '1234', roleId: 1 };

            //create a user same way like register test
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(dto)
                .expect(201);
            
            //then login and create cookie
            const loginResult = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: loginEmail, password: '1234' })
                .expect(200);
            const cookie = loginResult.headers['set-cookie'][0];

            //then logout with cookie
            const result = await request(app.getHttpServer())
                .post('/auth/logout')
                .set('Cookie', cookie)
                .expect(200);

            expect(result.body.message).toMatch(/logged out!/i);
        });
    });

    describe('/auth/whoami (GET)', () => {
        it('can return current user details', async () => {
            const loginEmail = `e2e_${Date.now()}@mail.com`;
            const dto = { email: loginEmail, password: '1234', roleId: 1 };

            //create a user same way like register test
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(dto)
                .expect(201);
            
            //then login and create cookie
            const loginResult = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: loginEmail, password: '1234' })
                .expect(200);
            /////////////// DEBUG

            console.log('Login Response Headers:', loginResult.headers);
            const cookieHeader = loginResult.headers['set-cookie'][0];
            console.log('Cookie Header:', cookieHeader);

            // Extract the full cookie string
            const cookie = cookieHeader.split(';')[0];
            console.log('Using Cookie:', cookie);

            // Test whoami with the full cookie
            const result = await request(app.getHttpServer())
                .get('/auth/whoami')
                .set('Cookie', cookie)
                .expect(200);

            console.log('Whoami Response:', result.body);

            /////////////
            expect(result.body).toEqual(
                expect.objectContaining({
                    email: loginEmail,
                    role: expect.any(Object)
                })
            );
        });

        it('can return 401 if token is invalid', async () => {
            await request(app.getHttpServer())
            .get('/auth/whoami')
            .expect(401);
        });
    });
});