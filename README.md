# Build and Deploy a Full Stack application to the Edge with Neon, Next.js and Vercel

## Sponsor
<img src="./img/neon.svg" />

Thank you to [Neon](https://bit.ly/NeonWithTom) for sponsoring this video!


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Introduction
Serverless functions allow us to deploy our code to the cloud without having to worry about the underlying infrastructure. In theory, this means your functions can scale infinitely and your bill will scale with your usage. This means you don't need to provision expensive infrastructure before you have any users.

Having your serverless provider deploy these functions to the edge means the functions are run close to the user, which means lower latency and faster response times.

However, a major issue with this is that serverless functions is they need to start up each time they are run. So if we have a slow connection that's meant to live for a long time, like a database connection, we'll be spending time creating connections that will only live for a short period of time.

What if we could connect to a database with a different protocol, like HTTP? This would mean we get the best of both worlds, we can have a long lived connection to our database, that are ready to be used by our serverless functions.

This is what the team at Neon have been working on and I'm excited to show just how easy it is to get started with Neon's serverless driver and Vercel edge functions. Neon have been kind enough to sponsor this video. However, everything they have build is open source and available on their GitHub, so if you like this technology but don't want to use Neon, that's totally fine.

Neon offers serverless Postgres with a very generous free-tier. If you would like to follow along with this video, make sure you have a Neon account by following the link in the description to sign up and get started.

In this video we are going to be building a deploying a simple application where users can create a page and anonymously post comments on pages.

## Technologies uses
- [Vercel for hosting](https://vercel.com)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Neon Serverless PostgreSQL](https://bit.ly/NeonWithTom)
- [Neon CLI](https://www.npmjs.com/package/neonctl)