# paperlampshade-fullstack-Ecom

This is a full-stack e-commerce application built to promote and support Nepalese handicrafts.

## 🛠 Tech Stack

**Frontend:**
- Next.js (v15) with TypeScript
- Tailwind CSS
- shadcn/ui
- ArcJet bot protection
- PayPal integration
- Protected routes with middleware
- Hosted on Vercel

**Backend:**
- Node.js + Express.js with typescript
- REST API with controller-based routing
- Prisma ORM
- PostgreSQL (Dockerized inside EC2)
- Hosted on AWS EC2 with security groups
- CI/CD with GitHub Actions

**Assets:**
- Images hosted on Cloudinary
- Optional support for AWS S3

## 🌏 Purpose

This is a personal project aimed at **promoting Nepalese handicrafts**. Fulfillment is managed by a team in Nepal, including teams of **BeadsJoyCrafts** and **Vintuna Crafts**.

> “I am deeply enthusiastic about handicrafts and believe that art and human skills must be preserved in the age of AI, machines, and automation.”

Visit the live site: [www.paperlampshade.com](https://www.paperlampshade.com)
The future vision is to evolve this into a SaaS platform where Nepalese artisans can:

Register as sellers

List and sell handmade products

Receive payments seamlessly

Benefit from centralized logistics handled by PaperLampshade

This SaaS will combine e-commerce, marketing, and logistics to support artists while offering customers a smooth shopping experience.

✨ Vision
Nepal is globally recognized for its handmade art. This platform aims to:

Preserve and promote traditional craftsmanship

Support artists by handling logistics

Make artisan goods accessible worldwide

NOTE: Make sure you get api from paypal and keep in .env, JWT and other required in this Project
## 🚀 Getting Started

### Client Setup

```bash
cd client
npm install
npm run dev

### Server Setup
cd server
npm install
npm run dev

