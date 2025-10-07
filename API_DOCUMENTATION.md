# API Documentation - Patas Conectadas

This document provides a comprehensive overview of all available API endpoints for the Patas Conectadas system.

## Base URL
```
http://localhost:3000
```

---

## 1. Animals Module (RF01, RF02, RF03)

### Get All Animals
- **Method:** `GET`
- **Endpoint:** `/animals`
- **Description:** Retrieve all animals with their status

### Get Animal by ID
- **Method:** `GET`
- **Endpoint:** `/animals/:id`
- **Description:** Retrieve a specific animal

### Create Animal
- **Method:** `POST`
- **Endpoint:** `/animals`
- **Description:** Register a new animal
- **Body:**
```json
{
  "nome": "string",
  "especie": "string",
  "raca": "string (optional)",
  "idade_aproximada": "number (optional)",
  "porte": "string (optional)",
  "data_resgate": "ISO date string",
  "id_status": "number",
  "historico_medico": "string (optional)"
}
```

### Update Animal
- **Method:** `PUT`
- **Endpoint:** `/animals/:id`
- **Description:** Update animal information

### Delete Animal
- **Method:** `DELETE`
- **Endpoint:** `/animals/:id`
- **Description:** Remove an animal from the system

### Get Medical History (RF03)
- **Method:** `GET`
- **Endpoint:** `/animals/:id/medical-history`
- **Description:** Retrieve detailed medical history of an animal

### Update Animal Status (RF02)
- **Method:** `PATCH`
- **Endpoint:** `/animals/:id/status/:statusId`
- **Description:** Update the life and adoption status of an animal

---

## 2. Volunteers Module (RF04, RF05)

### Get All Volunteers
- **Method:** `GET`
- **Endpoint:** `/volunteers`
- **Description:** Retrieve all volunteers

### Get Volunteer by ID
- **Method:** `GET`
- **Endpoint:** `/volunteers/:id`
- **Description:** Retrieve a specific volunteer

### Create Volunteer (RF04)
- **Method:** `POST`
- **Endpoint:** `/volunteers`
- **Description:** Register a new volunteer
- **Body:**
```json
{
  "nome": "string",
  "cpf": "string (11 digits)",
  "email": "string (email format)",
  "telefone": "string",
  "habilidades": "string (optional)",
  "preferencias_atuacao": "string (optional, RF05)"
}
```

### Update Volunteer
- **Method:** `PUT`
- **Endpoint:** `/volunteers/:id`
- **Description:** Update volunteer information (including preferences)

### Delete Volunteer
- **Method:** `DELETE`
- **Endpoint:** `/volunteers/:id`
- **Description:** Remove a volunteer from the system

---

## 3. Tasks Module (RF06)

### Get All Tasks
- **Method:** `GET`
- **Endpoint:** `/tasks`
- **Description:** Retrieve all tasks

### Get Task by ID
- **Method:** `GET`
- **Endpoint:** `/tasks/:id`
- **Description:** Retrieve a specific task

### Create Task
- **Method:** `POST`
- **Endpoint:** `/tasks`
- **Description:** Create a new task
- **Body:**
```json
{
  "descricao": "string",
  "data": "ISO date string",
  "id_status": "number",
  "id_voluntario": "number (optional)",
  "id_animal": "number (optional)"
}
```

### Update Task
- **Method:** `PUT`
- **Endpoint:** `/tasks/:id`
- **Description:** Update task information

### Delete Task
- **Method:** `DELETE`
- **Endpoint:** `/tasks/:id`
- **Description:** Remove a task from the system

### Assign Task to Volunteer (RF06)
- **Method:** `PATCH`
- **Endpoint:** `/tasks/:id/assign/:volunteerId`
- **Description:** Assign a task to a specific volunteer

### Complete Task (RF06)
- **Method:** `PATCH`
- **Endpoint:** `/tasks/:id/complete/:statusId`
- **Description:** Mark a task as completed

---

## 4. Donors Module

### Get All Donors
- **Method:** `GET`
- **Endpoint:** `/donors`
- **Description:** Retrieve all donors

### Get Donor by ID
- **Method:** `GET`
- **Endpoint:** `/donors/:id`
- **Description:** Retrieve a specific donor

### Create Donor
- **Method:** `POST`
- **Endpoint:** `/donors`
- **Description:** Register a new donor
- **Body:**
```json
{
  "nome": "string",
  "cpf_cnpj": "string (11-14 digits)",
  "contato": "string"
}
```

### Update Donor
- **Method:** `PUT`
- **Endpoint:** `/donors/:id`
- **Description:** Update donor information

### Delete Donor
- **Method:** `DELETE`
- **Endpoint:** `/donors/:id`
- **Description:** Remove a donor from the system

---

## 5. Donations Module (RF07, RF08)

### Get All Donations
- **Method:** `GET`
- **Endpoint:** `/donations`
- **Description:** Retrieve all donations

### Get Donation by ID
- **Method:** `GET`
- **Endpoint:** `/donations/:id`
- **Description:** Retrieve a specific donation

### Create Donation (RF07)
- **Method:** `POST`
- **Endpoint:** `/donations`
- **Description:** Register a new donation
- **Body:**
```json
{
  "tipo": "string",
  "valor_quantidade": "string",
  "descricao": "string (optional)",
  "data": "ISO date string",
  "id_doador": "number"
}
```

### Update Donation
- **Method:** `PUT`
- **Endpoint:** `/donations/:id`
- **Description:** Update donation information

### Delete Donation
- **Method:** `DELETE`
- **Endpoint:** `/donations/:id`
- **Description:** Remove a donation from the system

### Get Periodic Report (RF08)
- **Method:** `GET`
- **Endpoint:** `/donations/reports/periodic?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- **Description:** Generate periodic reports about donation impact
- **Query Parameters:**
  - `startDate`: Start date (ISO format)
  - `endDate`: End date (ISO format)

---

## 6. Events Module (RF09, RF10)

### Get All Events
- **Method:** `GET`
- **Endpoint:** `/events`
- **Description:** Retrieve all events

### Get Event by ID
- **Method:** `GET`
- **Endpoint:** `/events/:id`
- **Description:** Retrieve a specific event

### Create Event (RF09)
- **Method:** `POST`
- **Endpoint:** `/events`
- **Description:** Register a new event
- **Body:**
```json
{
  "nome": "string",
  "data": "ISO date string",
  "local": "string",
  "descricao": "string (optional)",
  "meta": "string (optional)"
}
```

### Update Event
- **Method:** `PUT`
- **Endpoint:** `/events/:id`
- **Description:** Update event information

### Delete Event
- **Method:** `DELETE`
- **Endpoint:** `/events/:id`
- **Description:** Remove an event from the system

### Add Participation (RF10)
- **Method:** `POST`
- **Endpoint:** `/events/participations`
- **Description:** Register volunteer or donor participation in an event
- **Body:**
```json
{
  "id_evento": "number",
  "id_voluntario": "number (optional)",
  "id_doador": "number (optional)",
  "funcao": "string"
}
```

### Get Event Participations
- **Method:** `GET`
- **Endpoint:** `/events/:id/participations`
- **Description:** Retrieve all participations for a specific event

---

## 7. Adopters Module

### Get All Adopters
- **Method:** `GET`
- **Endpoint:** `/adopters`
- **Description:** Retrieve all adopters

### Get Adopter by ID
- **Method:** `GET`
- **Endpoint:** `/adopters/:id`
- **Description:** Retrieve a specific adopter

### Create Adopter
- **Method:** `POST`
- **Endpoint:** `/adopters`
- **Description:** Register a new adopter
- **Body:**
```json
{
  "nome": "string",
  "cpf": "string (11 digits)",
  "endereco": "string",
  "contato": "string"
}
```

### Update Adopter
- **Method:** `PUT`
- **Endpoint:** `/adopters/:id`
- **Description:** Update adopter information

### Delete Adopter
- **Method:** `DELETE`
- **Endpoint:** `/adopters/:id`
- **Description:** Remove an adopter from the system

---

## 8. Adoptions Module (RF11, RF12)

### Get All Adoptions
- **Method:** `GET`
- **Endpoint:** `/adoptions`
- **Description:** Retrieve all adoptions

### Get Adoption by ID
- **Method:** `GET`
- **Endpoint:** `/adoptions/:id`
- **Description:** Retrieve a specific adoption

### Create Adoption (RF11)
- **Method:** `POST`
- **Endpoint:** `/adoptions`
- **Description:** Register a new adoption linking animal and adopter
- **Body:**
```json
{
  "data_adocao": "ISO date string",
  "termo_responsabilidade": "boolean",
  "id_animal": "number",
  "id_adotante": "number"
}
```

### Update Adoption
- **Method:** `PUT`
- **Endpoint:** `/adoptions/:id`
- **Description:** Update adoption information

### Delete Adoption
- **Method:** `DELETE`
- **Endpoint:** `/adoptions/:id`
- **Description:** Remove an adoption record

### Get Annual Report (RF12)
- **Method:** `GET`
- **Endpoint:** `/adoptions/reports/annual?year=YYYY`
- **Description:** Generate annual reports about adoption rates
- **Query Parameters:**
  - `year`: Year for the report (number)

---

## 9. Gamification Module (RF13, RF14)

### Get All Gamification Records
- **Method:** `GET`
- **Endpoint:** `/gamification`
- **Description:** Retrieve all gamification records

### Get Gamification Record by ID
- **Method:** `GET`
- **Endpoint:** `/gamification/:id`
- **Description:** Retrieve a specific gamification record

### Create Gamification Record (RF13)
- **Method:** `POST`
- **Endpoint:** `/gamification`
- **Description:** Award points to volunteers based on tasks
- **Body:**
```json
{
  "id_voluntario": "number",
  "pontos": "number (minimum 0)",
  "badge": "string (optional, RF14)",
  "data": "ISO date string"
}
```

### Update Gamification Record
- **Method:** `PUT`
- **Endpoint:** `/gamification/:id`
- **Description:** Update gamification record

### Delete Gamification Record
- **Method:** `DELETE`
- **Endpoint:** `/gamification/:id`
- **Description:** Remove a gamification record

### Get Volunteer Points
- **Method:** `GET`
- **Endpoint:** `/gamification/volunteer/:volunteerId`
- **Description:** Get total points and badges for a specific volunteer

### Get Ranking
- **Method:** `GET`
- **Endpoint:** `/gamification/ranking`
- **Description:** Get volunteer ranking by points and badges

---

## Requirement Mapping

### RF01: Animal Registration ✅
- `POST /animals`

### RF02: Update Animal Status ✅
- `PATCH /animals/:id/status/:statusId`

### RF03: View Medical History ✅
- `GET /animals/:id/medical-history`

### RF04: Volunteer Registration ✅
- `POST /volunteers`

### RF05: Register Volunteer Preferences ✅
- `POST /volunteers` (with `preferencias_atuacao` field)
- `PUT /volunteers/:id` (to update preferences)

### RF06: Task Assignment and Completion ✅
- `PATCH /tasks/:id/assign/:volunteerId`
- `PATCH /tasks/:id/complete/:statusId`

### RF07: Donation Registration ✅
- `POST /donations`

### RF08: Donation Impact Reports ✅
- `GET /donations/reports/periodic`

### RF09: Event Registration ✅
- `POST /events`

### RF10: Event Participation Registration ✅
- `POST /events/participations`

### RF11: Adoption Process Registration ✅
- `POST /adoptions`

### RF12: Annual Adoption Reports ✅
- `GET /adoptions/reports/annual`

### RF13: Points Attribution ✅
- `POST /gamification`

### RF14: Badge Awards ✅
- `POST /gamification` (with `badge` field)

---

## Notes

- All dates should be in ISO 8601 format (e.g., `2024-01-15T00:00:00.000Z`)
- All endpoints use JSON for request and response bodies
- Proper validation is implemented using class-validator decorators
- All modules follow NestJS best practices and the repository's existing structure
