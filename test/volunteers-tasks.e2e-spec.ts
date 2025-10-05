import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('Volunteers, Preferences, and Tasks (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let volunteerId: number;
  let taskId: number;
  let preferenceId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    // Clean up test data
    if (volunteerId) {
      await prisma.voluntario
        .delete({ where: { id_voluntario: volunteerId } })
        .catch(() => {});
    }
    if (taskId) {
      await prisma.tarefa
        .delete({ where: { id_tarefa: taskId } })
        .catch(() => {});
    }
    await app.close();
  });

  describe('Volunteers', () => {
    it('POST /volunteers - should create a new volunteer', () => {
      return request(app.getHttpServer())
        .post('/volunteers')
        .send({
          name: 'João Silva',
          cpf: '12345678901',
          email: 'joao.test@email.com',
          phone: '11987654321',
          skills: ['cuidados com filhotes', 'treinamento'],
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.name).toBe('João Silva');
          expect(response.body.cpf).toBe('12345678901');
          expect(response.body.email).toBe('joao.test@email.com');
          expect(response.body.skills).toEqual([
            'cuidados com filhotes',
            'treinamento',
          ]);
          volunteerId = response.body.id;
        });
    });

    it('POST /volunteers - should return 409 for duplicate CPF', () => {
      return request(app.getHttpServer())
        .post('/volunteers')
        .send({
          name: 'Maria Silva',
          cpf: '12345678901',
          email: 'maria.test@email.com',
          phone: '11987654321',
        })
        .expect(409);
    });

    it('POST /volunteers - should return 400 for invalid CPF', () => {
      return request(app.getHttpServer())
        .post('/volunteers')
        .send({
          name: 'Pedro Silva',
          cpf: '123',
          email: 'pedro.test@email.com',
          phone: '11987654321',
        })
        .expect(400);
    });

    it('GET /volunteers - should list all volunteers', () => {
      return request(app.getHttpServer())
        .get('/volunteers')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });

    it('GET /volunteers/:id - should get a specific volunteer', () => {
      return request(app.getHttpServer())
        .get(`/volunteers/${volunteerId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(volunteerId);
          expect(response.body.name).toBe('João Silva');
        });
    });

    it('PUT /volunteers/:id - should update volunteer', () => {
      return request(app.getHttpServer())
        .put(`/volunteers/${volunteerId}`)
        .send({
          name: 'João Pedro Silva',
          phone: '11999999999',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('João Pedro Silva');
          expect(response.body.phone).toBe('11999999999');
        });
    });
  });

  describe('Preferences', () => {
    it('POST /volunteers/:id/preferences - should create preferences', () => {
      return request(app.getHttpServer())
        .post(`/volunteers/${volunteerId}/preferences`)
        .send({
          preferences: ['filhotes', 'cães idosos', 'gatos resgatados'],
        })
        .expect(201)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBe(3);
          expect(response.body[0]).toHaveProperty('id');
          expect(response.body[0].preference).toBe('filhotes');
          preferenceId = response.body[0].id;
        });
    });

    it('GET /volunteers/:id/preferences - should list preferences', () => {
      return request(app.getHttpServer())
        .get(`/volunteers/${volunteerId}/preferences`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });

    it('DELETE /volunteers/:id/preferences/:prefId - should delete preference', () => {
      return request(app.getHttpServer())
        .delete(`/volunteers/${volunteerId}/preferences/${preferenceId}`)
        .expect(204);
    });

    it('POST /volunteers/:id/preferences - should return 404 for non-existent volunteer', () => {
      return request(app.getHttpServer())
        .post('/volunteers/999999/preferences')
        .send({
          preferences: ['teste'],
        })
        .expect(404);
    });
  });

  describe('Tasks', () => {
    beforeAll(async () => {
      // Ensure we have required status in database
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

    it('POST /tasks - should create a new task', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Limpar canil setor A',
          description: 'Realizar limpeza completa do canil setor A',
          target_entity: 'canil setor A',
          due_date: '2025-01-15T14:00:00.000Z',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.title).toBe('Limpar canil setor A');
          expect(response.body.status).toBe('pending');
          expect(response.body.assigned_to).toBeNull();
          taskId = response.body.id;
        });
    });

    it('GET /tasks - should list all tasks', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });

    it('GET /tasks?status=pending - should filter tasks by status', () => {
      return request(app.getHttpServer())
        .get('/tasks?status=pending')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          response.body.forEach((task: any) => {
            expect(task.status).toBe('pending');
          });
        });
    });

    it('POST /tasks/:id/assign - should assign task to volunteer', () => {
      return request(app.getHttpServer())
        .post(`/tasks/${taskId}/assign`)
        .send({
          volunteer_id: volunteerId,
        })
        .expect(200)
        .then((response) => {
          expect(response.body.status).toBe('assigned');
          expect(response.body.assigned_to).toHaveProperty('id', volunteerId);
        });
    });

    it('GET /volunteers/:id/tasks - should list tasks for volunteer', () => {
      return request(app.getHttpServer())
        .get(`/volunteers/${volunteerId}/tasks`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
          expect(response.body[0]).toHaveProperty('id', taskId);
        });
    });

    it('PATCH /tasks/:id/complete - should mark task as completed', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${taskId}/complete`)
        .expect(200)
        .then((response) => {
          expect(response.body.status).toBe('completed');
        });
    });

    it('PATCH /tasks/:id/complete - should return 400 for already completed task', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${taskId}/complete`)
        .expect(400);
    });

    it('POST /tasks/:id/assign - should return 404 for non-existent volunteer', () => {
      return request(app.getHttpServer())
        .post(`/tasks/${taskId}/assign`)
        .send({
          volunteer_id: 999999,
        })
        .expect(404);
    });
  });

  describe('Integration flow', () => {
    it('should complete full workflow: create volunteer, add preferences, create task, assign, complete', async () => {
      // Create volunteer
      const volunteerResponse = await request(app.getHttpServer())
        .post('/volunteers')
        .send({
          name: 'Integration Test User',
          cpf: '98765432100',
          email: 'integration@test.com',
          phone: '11999887766',
        })
        .expect(201);

      const testVolunteerId = volunteerResponse.body.id;

      // Add preferences
      await request(app.getHttpServer())
        .post(`/volunteers/${testVolunteerId}/preferences`)
        .send({
          preferences: ['testes automatizados'],
        })
        .expect(201);

      // Create task
      const taskResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task de teste',
          description: 'Teste de integração',
        })
        .expect(201);

      const testTaskId = taskResponse.body.id;

      // Assign task
      await request(app.getHttpServer())
        .post(`/tasks/${testTaskId}/assign`)
        .send({
          volunteer_id: testVolunteerId,
        })
        .expect(200);

      // Complete task
      await request(app.getHttpServer())
        .patch(`/tasks/${testTaskId}/complete`)
        .expect(200);

      // Verify volunteer has task
      const tasksResponse = await request(app.getHttpServer())
        .get(`/volunteers/${testVolunteerId}/tasks`)
        .expect(200);

      expect(tasksResponse.body.length).toBeGreaterThan(0);

      // Clean up
      await prisma.tarefa
        .delete({ where: { id_tarefa: testTaskId } })
        .catch(() => {});
      await prisma.voluntario
        .delete({ where: { id_voluntario: testVolunteerId } })
        .catch(() => {});
    });
  });
});
