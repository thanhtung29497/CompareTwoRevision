export interface compare<T> {
    (first: T, second : T) : boolean;
}

export class SearchingList <T> {
    /**
     * store a list of T elements and check if an element or a list of elements (type T) appears in this list
     * use Quicksort to store list and use BinarySearch to search
     * param1: an array of T elements
     * param2: a function indicates greater relation between two elements (just for sorting)
     * param3: a function sepecifies if two elements are equal
     */
    private _list : T[];
    private _isGreater : compare<T>;
    private _isEqual : compare<T>;
    constructor (array : T[] = null, isGreater : compare<T>, isEqual : compare<T> = (a: T, b: T) => a === b){
        this._list = array;
        this._isGreater = isGreater;
        this.sort(0,this._list.length-1);
        this._isEqual = isEqual;
    }

    private sort(start : number, end : number) : void {
        if (start >= end) return;
        let i = start, j = end;
        let pivot = this._list[start];
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
        this.sort(start,j);
        this.sort(i,end);
    }

    contain(element : T) : boolean {
        let start = 0, end = this._list.length-1;
        while (start <= end) {
            let mid = Math.floor((start + end) /2);
            if (this._isEqual(element, this._list[mid])) return true;
            if (this._isGreater(this._list[mid], element)) {
                end = mid-1;
            } else {
                start = mid + 1;
            }
        }
        return false;
    }

    getList() : T[] {
        return this._list;
    }

    missingList(listToCompare : SearchingList<T> | T[]) : T[] {
        // return a list includes all elements that appears in listToCompare but not in this list
        let missingList = [];
        if (listToCompare instanceof SearchingList) listToCompare = listToCompare.getList();
        listToCompare.forEach( element => {
            if (!this.contain(element)) {
                missingList.push(element);
            }
        })
        return missingList;
    }

    commonList(listToCompare : SearchingList<T> | T[]) : SearchingList<T> {
        // return a list includes all elements that appears in both listToCompare and this list
        let commonList = [];
        if (listToCompare instanceof SearchingList) listToCompare = listToCompare.getList();
        listToCompare.forEach( element => {
            if (this.contain(element)) {
                commonList.push(element);
            }
        })
        return new SearchingList<T>(commonList, this._isGreater);
    }
    find( elementToFind : T) : T {
        // return the element in this list that is equal to elementToFind
        let start = 0, end = this._list.length-1;
        while (start <= end) {
            let mid = Math.floor((start + end) /2);
            if (this._isEqual(elementToFind, this._list[mid])) return this._list[mid];
            if (this._isGreater(this._list[mid], elementToFind)) {
                end = mid-1;
            } else {
                start = mid + 1;
            }
        }
        return null;
    }

}