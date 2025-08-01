// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'phoneFormat',
//   standalone: true,
// })
// export class PhoneFormatPipe implements PipeTransform {
//   transform(value: string | number): string {
//     const raw = value.toString().trim();
//     const countryCodeMatch = raw.match(/^\+?\d{1,4}/);
//     const countryCode = countryCodeMatch ? countryCodeMatch[0] : '';
//     const remaining = raw.replace(countryCode, '').replace(/\D/g, '');
//     if (remaining.length !== 10) return value.toString();
//     const part1 = remaining.slice(0, 5);
//     const part2 = remaining.slice(5);
//     return `${countryCode} ${part1} - ${part2}`;
//   }
// }
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true,
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '';

    const raw = value.toString().replace(/\D/g, ''); // remove all non-digit chars
    let countryCode = '';
    let localNumber = raw;

    // Assume country code if number is longer than 10 digits
    if (raw.length > 10) {
      countryCode = '+' + raw.slice(0, raw.length - 10);
      localNumber = raw.slice(-10);
    }

    if (localNumber.length !== 10) return value.toString(); // invalid length

    const part1 = localNumber.slice(0, 5);
    const part2 = localNumber.slice(5);

    return `${countryCode} ${part1} - ${part2}`.trim();
  }
}
