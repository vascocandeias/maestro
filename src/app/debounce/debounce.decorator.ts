import { debounce as debounceFn } from 'lodash-es';

export function debounce( milliseconds : number = 0, options = {} ) {
  return function ( target : any, propertyKey : string, descriptor : PropertyDescriptor ) {
    const originalMethod = descriptor.value;
    descriptor.value = debounceFn(originalMethod, milliseconds, options);
    return descriptor;
  }
}