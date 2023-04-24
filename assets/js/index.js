var eventLogger = new Vue({
    el: "#eventlogger",
    data() {
        return {
            execute_code: '',
            eval_result: '',
            logged_events: [
            ],
            saved_events: [
            ],
            blocked_events: [
            ]
        }
    },
    methods: {
        copyEvent(event) {
            let text = `('${event.name}', ${addQuotes(event.args).join(', ')})`;

            // создание временного элемента для копирования
            let tempElement = document.createElement("textarea");
            tempElement.value = text;
            document.body.appendChild(tempElement);

            // выделение текста и копирование его в буфер обмена
            tempElement.select();
            document.execCommand("copy");

            // удаление временного элемента
            document.body.removeChild(tempElement)
        },
        emulateEvent(event){
            mp.trigger('emulateEvent', event.name, JSON.stringify(event.args))
        },
        pinEvent(event){
            if(this.saved_events.includes(event)){
                this.saved_events.splice(this.saved_events.indexOf(event), 1);
            }else{
                this.saved_events.push(event)
            }
        },
        blockEvent(event){
            if(this.blocked_events.includes(event)){
                this.blocked_events.splice(this.blocked_events.indexOf(event), 1);
            }else{
                this.blocked_events.push(event)
            }

            mp.trigger('updateBlock', JSON.stringify(this.blocked_events.map(obj => obj.name)))
        },
        addEvent(name, args){
            this.logged_events.push({name: name, args: JSON.parse(args)})
        },
        executeCode(){
            if(this.execute_code !== null && this.execute_code !== '' && this.execute_code.length > 0){
                mp.trigger('executeCode', this.execute_code)
            }
        }
    }
})


function rjs(str) {
    let newStr = '';
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '"' || str[i] === "'" || str[i] === "`" || str[i] === "\\") {
            newStr += "\\";
        }
        newStr += str[i];
    }
    return newStr;
}

function addQuotes(array) {
    return array.map(element => {
        if (typeof element === "string") {
            return `"${rjs(element)}"`;
        }
        return element;
    });
}

function eventRecived(name, args){
    eventLogger.addEvent(name, args)
}

function addBlocked(events){
    mp.trigger('cLog', 'Loading blocking events...')
    JSON.parse(events).forEach(element => {
        eventLogger.blocked_events.push({name: element, args: []})
    });
}

function setEvalResult(res){
    eventLogger.eval_result += `---\n${res}\n---\n`
}

function clearEval(){
    eventLogger.eval_result = ' '
}