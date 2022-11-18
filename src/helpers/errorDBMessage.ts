import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export const errorCodeDBMessageException = (error: any, logger: Logger) => {
  if (error.code === '23505') {
    throw new BadRequestException(error.detail);
  }
  logger.error(error);
  throw new InternalServerErrorException(
    'Error server, contacte al administrador',
  );
};
