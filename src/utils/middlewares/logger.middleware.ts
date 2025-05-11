import { Logger, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, hostname, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const start = Date.now();

    this.logger.log(`Incoming Request: ${method} ${originalUrl}`);

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.debug(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          method,
          url: originalUrl,
          hostname,
          ip,
          userAgent,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
        }),
      );
    });

    next();
  }
}
