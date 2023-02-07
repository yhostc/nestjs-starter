import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { XMLValidator, XMLParser } from 'fast-xml-parser';

export const XML = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const { body } = ctx.switchToHttp().getRequest();
  if (XMLValidator.validate(body) !== true) {
    return 'invalid xml';
  }

  const { xml } = new XMLParser().parse(body);
  return xml;
});
