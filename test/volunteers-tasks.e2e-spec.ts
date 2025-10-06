import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('Volunteers and Tasks (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Ensure task statuses exist
    await prisma.status_tarefa.upsert({
      where: { status: 'pending' },
      update: {},
      create: { status: 'pending' },
    });
    await prisma.status_tarefa.upsert({
      where: { status: 'assigned' },
      update: {},
      create: { status: 'assigned' },
    });
    await prisma.status_tarefa.upsert({
      where: { status: 'completed' },
      update: {},
      create: { status: 'completed' },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/volunteers (POST)', () => {
    it('should create a new volunteer', () => {
      return request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'João Silva',
          cpf: '12345678901',
          email: 'joao@example.com',
          telefone: '11999999999',
          habilidades: 'Cuidados com animais',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id_voluntario');
          expect(response.body.nome).toBe('João Silva');
          expect(response.body.cpf).toBe('12345678901');
          expect(response.body.email).toBe('joao@example.com');
        });
    });

    it('should reject duplicate CPF', async () => {
      // First volunteer with CPF 98765432100
      await request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Maria Santos',
          cpf: '98765432100',
          email: 'maria@example.com',
          telefone: '11888888888',
        })
        .expect(201);

      // Try to create another with same CPF
      return request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Pedro Oliveira',
          cpf: '98765432100',
          email: 'pedro@example.com',
          telefone: '11777777777',
        })
        .expect(409)
        .then((response) => {
          expect(response.body.message).toBe('CPF já cadastrado');
        });
    });

    it('should reject duplicate email', async () => {
      // First volunteer with email unique@test.com
      await request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Ana Costa',
          cpf: '11111111111',
          email: 'unique@test.com',
          telefone: '11666666666',
        })
        .expect(201);

      // Try to create another with same email
      return request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Carlos Lima',
          cpf: '22222222222',
          email: 'unique@test.com',
          telefone: '11555555555',
        })
        .expect(409)
        .then((response) => {
          expect(response.body.message).toBe('Email já cadastrado');
        });
    });

    it('should reject invalid CPF (not 11 digits)', () => {
      return request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Test User',
          cpf: '123',
          email: 'test@example.com',
          telefone: '11999999999',
        })
        .expect(400);
    });

    it('should reject invalid email', () => {
      return request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Test User',
          cpf: '33333333333',
          email: 'invalid-email',
          telefone: '11999999999',
        })
        .expect(400);
    });
  });

  describe('/volunteers (GET)', () => {
    it('should return all volunteers', () => {
      return request(app.getHttpServer())
        .get('/volunteers')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/volunteers/:id (GET)', () => {
    it('should return a specific volunteer', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Teste Busca',
          cpf: '44444444444',
          email: 'busca@test.com',
          telefone: '11444444444',
        });

      const volunteerId = createResponse.body.id_voluntario;

      return request(app.getHttpServer())
        .get(`/volunteers/${volunteerId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id_voluntario).toBe(volunteerId);
          expect(response.body.nome).toBe('Teste Busca');
        });
    });

    it('should return 404 for non-existent volunteer', () => {
      return request(app.getHttpServer()).get('/volunteers/999999').expect(404);
    });
  });

  describe('/volunteers/:id (PUT)', () => {
    it('should update a volunteer', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Teste Update',
          cpf: '55555555555',
          email: 'update@test.com',
          telefone: '11333333333',
        });

      const volunteerId = createResponse.body.id_voluntario;

      return request(app.getHttpServer())
        .put(`/volunteers/${volunteerId}`)
        .send({
          nome: 'Nome Atualizado',
          telefone: '11222222222',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.nome).toBe('Nome Atualizado');
          expect(response.body.telefone).toBe('11222222222');
        });
    });
  });

  describe('/volunteers/:id (DELETE)', () => {
    it('should delete a volunteer', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Teste Delete',
          cpf: '66666666666',
          email: 'delete@test.com',
          telefone: '11111111111',
        });

      const volunteerId = createResponse.body.id_voluntario;

      await request(app.getHttpServer())
        .delete(`/volunteers/${volunteerId}`)
        .expect(200);

      return request(app.getHttpServer())
        .get(`/volunteers/${volunteerId}`)
        .expect(404);
    });
  });

  describe('/volunteers/:id/preferences (POST)', () => {
    it('should create a preference for a volunteer', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Teste Preferencia',
          cpf: '77777777777',
          email: 'pref@test.com',
          telefone: '11000000000',
        });

      const volunteerId = createResponse.body.id_voluntario;

      return request(app.getHttpServer())
        .post(`/volunteers/${volunteerId}/preferences`)
        .send({
          tipo: 'area',
          valor: 'cuidados veterinários',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id_preferencia');
          expect(response.body.tipo).toBe('area');
          expect(response.body.valor).toBe('cuidados veterinários');
        });
    });

    it('should return 404 for non-existent volunteer', () => {
      return request(app.getHttpServer())
        .post('/volunteers/999999/preferences')
        .send({
          tipo: 'area',
          valor: 'test',
        })
        .expect(404);
    });
  });

  describe('/volunteers/:id/preferences (GET)', () => {
    it('should return all preferences for a volunteer', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Teste Lista Pref',
          cpf: '88888888888',
          email: 'listpref@test.com',
          telefone: '11999999998',
        });

      const volunteerId = createResponse.body.id_voluntario;

      // Create two preferences
      await request(app.getHttpServer())
        .post(`/volunteers/${volunteerId}/preferences`)
        .send({
          tipo: 'horario',
          valor: 'manhã',
        });

      await request(app.getHttpServer())
        .post(`/volunteers/${volunteerId}/preferences`)
        .send({
          tipo: 'area',
          valor: 'adoção',
        });

      return request(app.getHttpServer())
        .get(`/volunteers/${volunteerId}/preferences`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBe(2);
        });
    });
  });

  describe('/volunteers/:id/preferences/:prefId (DELETE)', () => {
    it('should delete a preference', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Teste Delete Pref',
          cpf: '99999999999',
          email: 'delpref@test.com',
          telefone: '11999999997',
        });

      const volunteerId = createResponse.body.id_voluntario;

      const prefResponse = await request(app.getHttpServer())
        .post(`/volunteers/${volunteerId}/preferences`)
        .send({
          tipo: 'test',
          valor: 'test value',
        });

      const prefId = prefResponse.body.id_preferencia;

      return request(app.getHttpServer())
        .delete(`/volunteers/${volunteerId}/preferences/${prefId}`)
        .expect(200);
    });
  });

  describe('/tasks (POST)', () => {
    it('should create a new task', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Vacinar cachorro',
          descricao: 'Aplicar vacina antirrábica no cachorro Rex',
          target_entity: 'animal',
          due_date: '2025-02-01',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id_tarefa');
          expect(response.body.title).toBe('Vacinar cachorro');
          expect(response.body.status_tarefa.status).toBe('pending');
        });
    });
  });

  describe('/tasks (GET)', () => {
    it('should return all tasks', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
        });
    });

    it('should filter tasks by status', async () => {
      // Create a pending task
      await request(app.getHttpServer()).post('/tasks').send({
        title: 'Task Pendente',
        descricao: 'Descrição da task pendente',
      });

      return request(app.getHttpServer())
        .get('/tasks?status=pending')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          response.body.forEach((task: any) => {
            expect(task.status_tarefa.status).toBe('pending');
          });
        });
    });
  });

  describe('/tasks/:id/assign (POST)', () => {
    it('should assign a task to a volunteer', async () => {
      // Create volunteer
      const volResponse = await request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Voluntário Tarefa',
          cpf: '10101010101',
          email: 'voltarefa@test.com',
          telefone: '11999999996',
        });

      const volunteerId = volResponse.body.id_voluntario;

      // Create task
      const taskResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task para atribuir',
          descricao: 'Descrição',
        });

      const taskId = taskResponse.body.id_tarefa;

      // Assign task
      return request(app.getHttpServer())
        .post(`/tasks/${taskId}/assign`)
        .send({
          id_voluntario: volunteerId,
        })
        .expect(201)
        .then((response) => {
          expect(response.body.id_voluntario).toBe(volunteerId);
          expect(response.body.status_tarefa.status).toBe('assigned');
        });
    });

    it('should reject assignment to non-existent volunteer', async () => {
      const taskResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task teste',
          descricao: 'Descrição',
        });

      const taskId = taskResponse.body.id_tarefa;

      return request(app.getHttpServer())
        .post(`/tasks/${taskId}/assign`)
        .send({
          id_voluntario: 999999,
        })
        .expect(404);
    });
  });

  describe('/tasks/:id/complete (PATCH)', () => {
    it('should complete an assigned task', async () => {
      // Create volunteer
      const volResponse = await request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Voluntário Complete',
          cpf: '20202020202',
          email: 'volcomplete@test.com',
          telefone: '11999999995',
        });

      const volunteerId = volResponse.body.id_voluntario;

      // Create and assign task
      const taskResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task para completar',
          descricao: 'Descrição',
        });

      const taskId = taskResponse.body.id_tarefa;

      await request(app.getHttpServer()).post(`/tasks/${taskId}/assign`).send({
        id_voluntario: volunteerId,
      });

      // Complete task
      return request(app.getHttpServer())
        .patch(`/tasks/${taskId}/complete`)
        .expect(200)
        .then((response) => {
          expect(response.body.status_tarefa.status).toBe('completed');
        });
    });

    it('should reject completing a pending task', async () => {
      const taskResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task pendente',
          descricao: 'Descrição',
        });

      const taskId = taskResponse.body.id_tarefa;

      return request(app.getHttpServer())
        .patch(`/tasks/${taskId}/complete`)
        .expect(400);
    });
  });

  describe('/volunteers/:id/tasks (GET)', () => {
    it('should return all tasks for a volunteer', async () => {
      // Create volunteer
      const volResponse = await request(app.getHttpServer())
        .post('/volunteers')
        .send({
          nome: 'Voluntário Tasks',
          cpf: '30303030303',
          email: 'voltasks@test.com',
          telefone: '11999999994',
        });

      const volunteerId = volResponse.body.id_voluntario;

      // Create and assign task
      const taskResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task do voluntário',
          descricao: 'Descrição',
        });

      const taskId = taskResponse.body.id_tarefa;

      await request(app.getHttpServer()).post(`/tasks/${taskId}/assign`).send({
        id_voluntario: volunteerId,
      });

      // Get volunteer tasks
      return request(app.getHttpServer())
        .get(`/volunteers/${volunteerId}/tasks`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
          expect(response.body[0].id_voluntario).toBe(volunteerId);
        });
    });
  });
});
