# Verity

![Version](https://img.shields.io/github/v/release/platacard/verity?label=Verity&logo=github)
![Latest Package Version](https://img.shields.io/npm/v/@verityjs/cli?label=@verityjs/cli&logo=npm)
![Latest Package Version](https://img.shields.io/npm/v/@verityjs/client?label=@verityjs/client&logo=npm)

Verity is a service that allows you to create new versions of various applications and connect them
to each other. Manage your applications easily and efficiently.

## Local Development

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js LTS](https://nodejs.org/en/)

### Getting Started

1. Clone the repository:

```bash
git clone git@github.com:platacard/verity.git
```

or

```bash
git clone https://github.com/platacard/verity.git
```

2. Change to the project directory:

```bash
cd verity
```

3. Create a `.env` file in the root of the project and fill like in [this](.env.template) example:

```bash
touch .env
```

4. Start the development environment:

```bash
docker-compose up -d
```

5. Install the dependencies:

```bash
npm install
```

6. Start the development server:

```bash
npm start
```

7. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

8. Login with the following credentials:

- **Username:** verity
- **Password:** verity

9. You're all set! 🚀
