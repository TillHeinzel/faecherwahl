class Program
{
    // chosen classes manager. Also takes care of communicating with the grid showing chosen classes
    faecherwahl = new FaecherwahlManager(); 
    dialogsJson; 

    // Manager for dialog-data. Its a bit complex due to the need to add subdialogs
    dialogFlow = new DialogFlowManager(new Conditions(this.faecherwahl));

    // Manager for the Dialogs the user interacts with. Also takes care of displaying them
    openDialogs = new OpenDialogsManager(new OptionsFilter(this.faecherwahl), document.getElementById("dialogs"));

    constructor(dialogsJson, obligatorischeFaecher)
    {
        this.dialogsJson = dialogsJson;

        // add obligatorische Fächer
        this.faecherwahl.push(obligatorischeFaecher);
    }

    get allDialogsDone()
    {
        return this.dialogFlow.dialogsDone;
    }

    async run()
    {
        this.#initializeStudienrichtungsDialog();

        // Listening Loop
        while (true)
        {
            const { level, option } = await this.openDialogs.anyOptionInAnyDialogClicked();

            this.#resetToPotentiallyEarlierLevel(level);

            this.#handleSelectedOption(option);

            // Progress to get dialogs in new useful state, including opening dialogs or ending dialog interaction (we keep listening though, to be able to respond to people going back and changing inputs)
            this.#progressDialogs();
        }
    }

    #initializeStudienrichtungsDialog()
    {
        this.dialogFlow.push(['studienrichtungen'])

        this.#progressDialogs();
    }

    #resetToPotentiallyEarlierLevel(level)
    {
        // reset to handle selection of a previous dialog 
        this.faecherwahl.resetToLevel(level);
        this.dialogFlow.resetToLevel(level);
        this.openDialogs.resetToLevel(level);
    }

    #handleSelectedOption(option)
    {
        this.faecherwahl.push(faecherFromOption(option));
        if (option.hasOwnProperty('subdialogs')) this.dialogFlow.push(option.subdialogs);
    }

    #progressDialogs()
    {
        let progression = this.dialogFlow.progress();

        // if conditions disable some dialogs, keep moving past them until we hit either a non-disabled dialog, or the end of the line. dummy dialogs are pushed to openDialogs to keep the levels of the stacks in line with each other.
        while (progression.state === Progression.DisabledDueToCondition)
        {
            this.openDialogs.addDummyDialog();
            progression = this.dialogFlow.progress();
        }

        if (progression.state === Progression.Valid)
        {
            const dialog = this.openDialogs.openDialog(this.dialogsJson[progression.nextDialogKey]);
            dialog.scrollIntoView({ behavior: "smooth" });

            return;
        }
        if (progression.state === Progression.Finished)
        {
            document.getElementById('print-area').scrollIntoView({ behavior: "smooth", block:"end" });
        }
    }
}
