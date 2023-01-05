import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { errors } from './responseCodes';
// import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';
// import { isNumber } from './utils';
export function isNumber(value: string | number): boolean {
  return value != null && value !== '' && !isNaN(Number(value.toString()));
}
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    // const i18n = getI18nContextFromArgumentsHost(host);
    // console.log(exception?.response)
    /** mongodb dublicat key error handler */
    let message = "";
    switch (exception.code) {
      case 11000:
        // message = i18n.t('errors.duplicateKey',{args:{fieldName:`${Object.keys(exception.keyValue)}`}});
        message = errors.duplicateKey.message + `${Object.keys(exception.keyValue)}`;
        exception.statusCode = 400;
        exception.errorCode = errors.duplicateKey.code
        break;
      default:
        message = exception['message'];
        break;

    }

    const status =
      isNumber(exception?.statusCode) ? exception?.statusCode : isNumber(exception?.response?.statusCode) ? exception.response?.statusCode : exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // let message = exception['message'];


    const res = {
      statusCode: status,
      status: false,
      message: exception instanceof String ? exception : exception.response ? exception?.response?.message?.toString() : message?.toString(),
      code: exception?.response?.code ? exception.response.code : errors.internalServerError.code,
      description: exception.response?.description,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    response.status(status)
    response.send(res);
    // response.status(status).json({
    //   statusCode: status,
    //   message: exception['response'] ? exception['response']['message'].toString() : message,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    // });
  }
}
