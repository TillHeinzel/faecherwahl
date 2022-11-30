class DialogDataStack
{
    #dialogStack = [];

    constructor(dialogsData)
    {
        this.dialogsData = dialogsData;
    }

    hasDataAt(level)
    {
        return level < this.#constructArray().length;
    }

    getDialogData(level)
    {
        const nextDialogName = this.#getDialogName(level);
        return this.dialogsData[nextDialogName];
    }

    push(newLevel, newDialogs)
    {
        this.#clearAbove(newLevel - 1);
        this.#dialogStack.push({
            offset: newLevel,
            dialogs: newDialogs
        });
    }

    #clearAbove(level)
    {
        const indexToClear = this.#dialogStack.findIndex((e) => e.offset > level);
        if (indexToClear === -1)
            return;

        this.#dialogStack.splice(indexToClear, this.#dialogStack.length);
    }

    #getDialogName(index)
    {
        return this.#constructArray()[index];
    }

    #constructArray()
    {
        let array = [];

        this.#dialogStack.forEach(({
            offset,
            dialogs
        }) =>
        {

            array = insertAt(array, dialogs, offset);
        });

        return array;
    }
}

function insertAt(arr1, arr2, index)
{
    const tail = arr1.splice(index, arr1.length);
    return arr1.concat(arr2).concat(tail);
}