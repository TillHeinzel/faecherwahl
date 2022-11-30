
class DialogsManager
{
    #dialogs = [];
    #optionsFilter;
    #dialogsRootElement

    constructor(optionsFilter, dialogsRootElement)
    {
        this.#optionsFilter = optionsFilter;
        this.#dialogsRootElement = dialogsRootElement;
    }

    openDialog(level, { title, options })
    {
        if(level > 0) this.#resetToLevel(level - 1);

        const dialog = new Dialog(title, level, this.#optionsFilter.filterOptions(options));

        this.#dialogsRootElement.appendChild(dialog.element);

        this.#dialogs.push(dialog);

        return dialog.element;
    }

    async getAnyResponse()
    {
        return await Promise.race(this.#dialogs.map(dialog => dialog.getPromise())).then(({ index, level }) =>
        {
            const option = this.#dialogs[level].options[index];
            return { level, option };
        });
    }

    #resetToLevel(level)
    {
        const removedDialogs = this.#dialogs.splice(level + 1, this.#dialogs.length);
        removedDialogs.forEach(dialog => dialog.clear());
    }

}
