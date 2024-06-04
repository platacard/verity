import { NextResponse } from 'next/server';

import { prisma } from '@verity/prisma';

import { App, CreateAppDto, RawApp } from '../models';

export const createApp = async (data: CreateAppDto) => {
  const { id } = data;

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  try {
    const app: RawApp = await prisma.app.create({
      data: {
        id,
      },
    });

    return NextResponse.json(new App(app));
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
