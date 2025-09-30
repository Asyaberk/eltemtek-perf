//this is be e2e test for book module
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('BookController (e2e)', () => {
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

  //Her testten sonra test bookları temizle
  afterEach(async () => {
    await dataSource.query(`DELETE FROM "book" WHERE title LIKE 'e2e Test Book'`);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('/library/books (GET)', () => {
    it('can return a list of all books', async () => {
      //login as admin because only admins can create book
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'adminUser@mail.com', password: '1' })
        .expect(200);
      const cookie = loginRes.headers['set-cookie'][0];
      
      // create a test book
      const dto = { title: 'e2e Test Book', author: 'Test Author', publishedyear: 2025 };
      await request(app.getHttpServer())
        .post('/books/create')
        .set('Cookie', cookie)
        .send(dto)
        .expect(201);

      //all users can see the list of books
      const result = await request(app.getHttpServer())
        .get('/library/books')
        .set('Cookie', cookie)
        .expect(200);
      
      expect(result.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining(dto),
        ]),
      );
    });
  });

  describe('/books/create (POST)(Admin only)', () => {
    it('can create a new book', async () => {
      //login ADMİN user
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'adminUser@mail.com', password: '1' })
        .expect(200);
      const cookie = loginRes.headers['set-cookie'][0];
      
      //create book
      const dto = { title: 'e2e Test Book', author: 'Test Author', publishedyear: 2025 };
        
      const result = await request(app.getHttpServer())
        .post('/books/create')
        .set('Cookie', cookie)
        .send(dto)
        .expect(201);
      
      expect(result.body.title).toBe(dto.title);
      expect(result.body.author).toBe(dto.author);
    });
  });

  describe('/update/:id (POST)(Admin only)', () => {
    it('can update a book by ID', async () => {
      //login ADMİN user
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'adminUser@mail.com', password: '1' })
        .expect(200);
      const cookie = loginRes.headers['set-cookie'][0];
      
      //create book
      const createRes = await request(app.getHttpServer())
        .post('/books/create')
        .set('Cookie', cookie)
        .send({ title: 'e2e Test Book', author: 'Test Author', publishedyear: 2025 })
        .expect(201);
      const bookId = createRes.body.id;
      
      //update book
      const result = await request(app.getHttpServer())
        .put(`/books/update/${bookId}`)
        .set('Cookie', cookie)
        .send({title: 'Updated Title Book'})
        .expect(200);
      
      expect(result.body.title).toBe('Updated Title Book');
    });
  });

  describe('/delete/:id (POST)(Admin only)', () => {
    it('can delete a book by ID', async () => {
      //login ADMİN user
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'adminUser@mail.com', password: '1' })
        .expect(200);
      const cookie = loginRes.headers['set-cookie'][0];
      
      //create book
      const createRes = await request(app.getHttpServer())
        .post('/books/create')
        .set('Cookie', cookie)
        .send({ title: 'e2e Test Book', author: 'Test Author', publishedyear: 2025 })
        .expect(201);
      const bookId = createRes.body.id;

      //delete book
      return request(app.getHttpServer())
        .delete(`/books/delete/${bookId}`)
        .set('Cookie', cookie)
        .expect(200);
    });
  });
});
