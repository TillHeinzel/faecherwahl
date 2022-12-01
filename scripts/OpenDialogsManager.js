
class OpenDialogsManager
{
    #dialogs = [];
    #optionsFilter;
    #dialogsRootElement

    constructor(optionsFilter, dialogsRootElement)
    {
        this.#optionsFilter = optionsFilter;
        this.#dialogsRootElement = dialogsRootElement;
    }

    get numberOfOpenDialogs()
    {
        return this.#dialogs.length;
    }

    openDialog({ title, options })
    {
        const dialog = new OpenDialog(title, this.numberOfOpenDialogs, this.#optionsFilter.filterOptions(options));

        this.#dialogsRootElement.appendChild(dialog.visualElement);

        this.#dialogs.push(dialog);

        return dialog.visualElement;
    }

    addDummyDialog()
    {
        this.#dialogs.push(
            {
                clear: function () { },
                getPromise: function () {
                    return new Promise(() => { });
                }
            });
    }

    async anyOptionInAnyDialogClicked()
    {
        return await Promise.race(this.#dialogs.map(dialog => dialog.getPromise())).then(({ index, level }) =>
        {
            const option = this.#dialogs[level].options[index];
            return { level, option };
        });
    }

    resetToLevel(level)
    {
        const removedDialogs = this.#dialogs.splice(level + 1, this.#dialogs.length);
        removedDialogs.forEach(dialog => dialog.clear());
    }

}
