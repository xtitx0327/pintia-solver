const queryURL = 'https://g4f.xtitx327.top';
const generate = async (problem, option, index) => {
    document.getElementById(`regen-${index}`).style.display = 'none';
    try {
        await (async () => {
            const response = await fetch(queryURL + '/g4f', {
                method: 'POST',
                body: JSON.stringify({
                    problem: problem,
                    options: option
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status !== 200) {
                document.getElementById(`answer-${index}`).textContent = '请求失败';
                document.getElementById(`solution-${index}`).textContent = '请求失败';
                return;
            }

            const data = await response.text();
            const result = JSON.parse(data);
            const answer = result.答案;
            const solution = result.解析;

            document.getElementById(`answer-${index}`).textContent = answer;
            document.getElementById(`solution-${index}`).textContent = solution;
        })();
    } catch (error) {
        console.log(error);
        document.getElementById(`answer-${index}`).textContent = '请求失败';
        document.getElementById(`solution-${index}`).textContent = '请求失败';
    } finally {
        document.getElementById(`regen-${index}`).style.display = 'flex';
    }
};

setTimeout(async () => {
    if (!window.location.href.match(/https:\/\/pintia\.cn\/problem-sets\/.*\/exam\/problems\/type\/2/)) {
        console.log('PTA solver skipped...');
        return;
    }

    const problemElementList = document.querySelector('.col-span-12').querySelectorAll('.pc-v.pc-gap-12');
    const problemList = [];
    const optionList = [];

    for (const item of problemElementList) {
        problemList.push(item.childNodes[0].textContent);
        const optionElementList = item.childNodes[1];
        const options = [];
        for (const option of optionElementList.childNodes)
            options.push(option.textContent);
        optionList.push(options);
    }

    for (let index = 0; index < problemElementList.length; ++ index) {
        const element = problemElementList[index];
        const solutionDisplayer = document.createElement('div');
        solutionDisplayer.className = 'solution-container';
        solutionDisplayer.innerHTML = `
        <div style="padding: 15px; border-radius: 5px; border-style: solid; border-color: hsl(100, 60%, 47%); border-width: 0.5px; box-shadow: 1.5px 1.5px 5px hsl(100, 60%, 47%); width: 100%; line-height: 1.2;">
            <h4>本题答案：</h4>
            <span id="answer-${index}">思考中……</span>
            <h4 style="margin-top: 15px;">解析：</h4>
            <span id="solution-${index}">思考中……</span>
            <div style="display: flex; flex-direction: row; align-items: flex-end; width: 100%; text-align: right; font-size: 12px; margin-top: 15px;">
                <div class="pc-button cursor-pointer" id="regen-${index}" style="display: none; align-items: center;">
                    <span style="color: white; font-size: 14px;">重新生成</span>
                </div>
                <div style="flex-grow: 1;"></div>
                <span>拼题 A 刷题助手&nbsp;·&nbsp;<span style="color: gray;">答案解析由 ChatGPT 生成，仅供参考，不保证准确</span></span>
            </div>
        </div>
        `;
        element.appendChild(solutionDisplayer);

        await generate(problemList[index], optionList[index], index);
        document.getElementById(`regen-${index}`).addEventListener('click', async () => {
            document.getElementById(`answer-${index}`).textContent = '思考中……';
            document.getElementById(`solution-${index}`).textContent = '思考中……';
            await generate(problemList[index], optionList[index], index);
        });
    }
}, 3000);