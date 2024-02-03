export default class Difference {
    constructor(oldOfficer, newOfficer, items) {
        this.oldOfficer = document.querySelector(oldOfficer);
        this.newOfficer = document.querySelector(newOfficer);
        this.oldItems = this.oldOfficer.querySelectorAll(items);
        this.newItems = this.newOfficer.querySelectorAll(items);
        this.oldCounter = 0;
        this.newCounter = 0;
    }

    bindTriggers(officer, item, counter) {
        officer.querySelector('.plus').addEventListener('click', () => {
            if (counter !== item.length - 2) {
                item[counter].style.display = 'flex';
                counter++;
            } else {
                item[counter].style.display = 'flex';
                item[item.length - 1].remove();
            }
        });
    }

    hideItems(item) {
        item.forEach((item, i, arr) => {
            if (i !== arr.length - 1) {
                item.style.display = 'none';
            }
        });

    }

    init() {
        this.hideItems(this.oldItems);
        this.hideItems(this.newItems);
        
        this.bindTriggers(this.oldOfficer, this.oldItems, this.oldCounter);
        this.bindTriggers(this.newOfficer, this.newItems, this.newCounter);
    }
}