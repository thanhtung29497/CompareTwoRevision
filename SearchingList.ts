export interface compare<T> {
    (first: T, second : T) : boolean;
}

export class SearchingList <T> {
    private _list : T[];
    private _isGreater : compare<T>;
    private _isEqual : compare<T>;
    constructor (array : T[] = null, isGreater : compare<T>, isEqual : compare<T> = (a: T, b: T) => a === b){
        this._list = array;
        this._isGreater = isGreater;
        this.sort(0,this._list.length-1);
        this._isEqual = isEqual;
    }

    private sort(l : number, r : number) : void {
        if (l >= r) return;
        let i = l, j = r;
        let pivot = this._list[l];
        do {
            while (this._isGreater(this._list[j], pivot)) j--;
            while (this._isGreater(pivot, this._list[i])) i++;
            if (i <= j) {
                let tmp = this._list[i];
                this._list[i] = this._list[j];
                this._list[j] = tmp;
                i++;
                j--;
            }
        } while (i <= j);
        this.sort(l,j);
        this.sort(i,r);
    }

    contain(element : T) : boolean {
        let l = 0, r = this._list.length-1;
        while (l <= r) {
            let mid = Math.floor((l + r) /2);
            if (this._isEqual(element, this._list[mid])) return true;
            if (this._isGreater(this._list[mid], element)) {
                r = mid-1;
            } else {
                l = mid + 1;
            }
        }
        return false;
    }

    getList() : T[] {
        return this._list;
    }

    missingList(list : SearchingList<T> | T[]) : T[] {
        let missingList = [];
        if (list instanceof SearchingList) list = list.getList();
        list.forEach( element => {
            if (!this.contain(element)) {
                missingList.push(element);
            }
        })
        return missingList;
    }

    commonList(list : SearchingList<T> | T[]) : SearchingList<T> {
        let commonList = [];
        if (list instanceof SearchingList) list = list.getList();
        list.forEach( element => {
            if (this.contain(element)) {
                commonList.push(element);
            }
        })
        return new SearchingList<T>(commonList, this._isGreater);
    }
    find( element : T) : T {
        let l = 0, r = this._list.length-1;
        while (l <= r) {
            let mid = Math.floor((l + r) /2);
            if (this._isEqual(element, this._list[mid])) return this._list[mid];
            if (this._isGreater(this._list[mid], element)) {
                r = mid-1;
            } else {
                l = mid + 1;
            }
        }
        return null;
    }

}