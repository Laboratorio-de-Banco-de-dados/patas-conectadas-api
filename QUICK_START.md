# Quick Start Guide - Patas Conectadas API

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd patas-conectadas-api
npm install
```

2. **Configure Database**
Create a `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/patas_conectadas"
```

3. **Initialize Database**
```bash
# Run the SQL schema (if needed)
psql -U your_user -d patas_conectadas < prisma/sql_start.sql

# Generate Prisma Client
npx prisma generate
```

4. **Start Development Server**
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

---

## 📍 Available Endpoints

### Animals
```
GET    /animals                       # List all
GET    /animals/:id                   # Get one
POST   /animals                       # Create
PUT    /animals/:id                   # Update
DELETE /animals/:id                   # Delete
GET    /animals/:id/medical-history   # Medical history
PATCH  /animals/:id/status/:statusId  # Update status
```

### Volunteers
```
GET    /volunteers       # List all
GET    /volunteers/:id   # Get one
POST   /volunteers       # Create
PUT    /volunteers/:id   # Update
DELETE /volunteers/:id   # Delete
```

### Tasks
```
GET    /tasks                              # List all
GET    /tasks/:id                          # Get one
POST   /tasks                              # Create
PUT    /tasks/:id                          # Update
DELETE /tasks/:id                          # Delete
PATCH  /tasks/:id/assign/:volunteerId     # Assign task
PATCH  /tasks/:id/complete/:statusId      # Complete task
```

### Donors
```
GET    /donors       # List all
GET    /donors/:id   # Get one
POST   /donors       # Create
PUT    /donors/:id   # Update
DELETE /donors/:id   # Delete
```

### Donations
```
GET    /donations                                              # List all
GET    /donations/:id                                          # Get one
POST   /donations                                              # Create
PUT    /donations/:id                                          # Update
DELETE /donations/:id                                          # Delete
GET    /donations/reports/periodic?startDate=X&endDate=Y     # Report
```

### Events
```
GET    /events                      # List all
GET    /events/:id                  # Get one
POST   /events                      # Create
PUT    /events/:id                  # Update
DELETE /events/:id                  # Delete
POST   /events/participations       # Add participation
GET    /events/:id/participations   # Get participants
```

### Adopters
```
GET    /adopters       # List all
GET    /adopters/:id   # Get one
POST   /adopters       # Create
PUT    /adopters/:id   # Update
DELETE /adopters/:id   # Delete
```

### Adoptions
```
GET    /adoptions                         # List all
GET    /adoptions/:id                     # Get one
POST   /adoptions                         # Create
PUT    /adoptions/:id                     # Update
DELETE /adoptions/:id                     # Delete
GET    /adoptions/reports/annual?year=X  # Annual report
```

### Gamification
```
GET    /gamification                          # List all
GET    /gamification/:id                      # Get one
POST   /gamification                          # Create
PUT    /gamification/:id                      # Update
DELETE /gamification/:id                      # Delete
GET    /gamification/volunteer/:volunteerId  # Volunteer points
GET    /gamification/ranking                  # Leaderboard
```

---

## 📝 Example Requests

### Create an Animal
```bash
curl -X POST http://localhost:3000/animals \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Rex",
    "especie": "cão",
    "raca": "Labrador",
    "idade_aproximada": 3,
    "porte": "grande",
    "data_resgate": "2024-01-15",
    "id_status": 1,
    "historico_medico": "Vacinado, castrado"
  }'
```

### Create a Volunteer
```bash
curl -X POST http://localhost:3000/volunteers \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "cpf": "12345678901",
    "email": "maria@example.com",
    "telefone": "11999999999",
    "habilidades": "Veterinária",
    "preferencias_atuacao": "Cuidados médicos"
  }'
```

### Register a Donation
```bash
curl -X POST http://localhost:3000/donations \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "monetária",
    "valor_quantidade": "500.00",
    "descricao": "Doação mensal",
    "data": "2024-01-15",
    "id_doador": 1
  }'
```

### Get Donation Report
```bash
curl "http://localhost:3000/donations/reports/periodic?startDate=2024-01-01&endDate=2024-12-31"
```

### Award Points to Volunteer
```bash
curl -X POST http://localhost:3000/gamification \
  -H "Content-Type: application/json" \
  -d '{
    "id_voluntario": 1,
    "pontos": 100,
    "badge": "Voluntário do Mês",
    "data": "2024-01-15"
  }'
```

### Get Volunteer Ranking
```bash
curl http://localhost:3000/gamification/ranking
```

---

## 🔍 Testing

### Run Build
```bash
npm run build
```

### Run Linter
```bash
npm run lint
```

### Run Tests (when available)
```bash
npm test
```

---

## 📚 Documentation Files

- **API_DOCUMENTATION.md** - Complete API reference with all endpoints
- **IMPLEMENTATION_SUMMARY.md** - Detailed implementation guide
- **README.md** - Project README

---

## 🛠️ Development Tips

### Adding a New Field to an Existing Module

1. Update the DTO:
```typescript
// src/domain/animals/create-animal.dto.ts
@IsString()
@IsOptional()
new_field?: string;
```

2. The Prisma schema should already have the field (check `prisma/schema.prisma`)

3. Rebuild:
```bash
npm run build
```

### Creating Custom Endpoints

Add methods to the service and controller:

```typescript
// Service
async customMethod(id: number) {
  return await this.prisma.model.findMany({
    where: { custom_condition: id }
  });
}

// Controller
@Get('custom/:id')
customEndpoint(@Param('id', ParseIntPipe) id: number) {
  return this.service.customMethod(id);
}
```

---

## 🐛 Troubleshooting

### Database Connection Error
- Check your `.env` file
- Ensure PostgreSQL is running
- Verify database credentials

### Build Errors
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Prisma Errors
```bash
# Regenerate Prisma client
npx prisma generate
```

---

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review the code examples above
3. Consult the existing code structure

---

## ✨ Next Steps

- Add authentication (JWT)
- Implement file uploads
- Add pagination
- Create advanced filters
- Add email notifications
- Build admin dashboard

---

**Happy Coding! 🚀**
