
main()
async function main()
{
    const program = new Program(
        await getData('data/dialogs.json'),
        await getData('data/obligatorischeFaecher.json'));

    // hook up the print-Button, so it can check, whether all dialogs have been taken care of
    document.getElementById('print-button').onclick = makePrintCallback(program)

    program.run();
}

function makePrintCallback(program)
{
    return function ()
    {
        const errorLabel = document.getElementById('errorLabel');
        if (!program.allDialogsDone)
        {
            errorLabel.innerHTML = 'Du must in jedem Kasten oben eine Möglichkeit wählen';
            return;
        }
        if (!document.getElementById('name-input').value.trim().length > 0)
        {
            errorLabel.innerHTML = 'Du musst oben noch deinen Namen eingeben';
            return;
        }
        if (!document.getElementById('klasse-input').value.trim().length > 0)
        {
            errorLabel.innerHTML = 'Du musst oben noch deine Klasse eingeben';
            return;
        }

        errorLabel.innerHTML = ' ';

        document.getElementById("name-output").innerText = "Name: " + document.getElementById("name-input").value;
        document.getElementById("klasse-output").innerText = "Klasse: " + document.getElementById("klasse-input").value;

        window.print()
    }
}

async function getData(relativePath)
{
    return await (await fetch(relativePath)).json();
}
