import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genericFilter'
})
export class GenericFilterPipe implements PipeTransform {
  pasDeResultat: boolean = false;
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }
    else this.pasDeResultat;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const itemValue = item[key];
          if (typeof itemValue === 'string' && itemValue.toLowerCase().includes(searchText)) {
            return true;
          }
        }
      }
      return false;
    });
  }
}
