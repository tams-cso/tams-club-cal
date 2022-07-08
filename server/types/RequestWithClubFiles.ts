import type { Request } from 'express';

export type RequestWithClubFiles = Request & { files: { cover: MulterFile[]; exec: MulterFile[] } };
