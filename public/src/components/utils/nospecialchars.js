
export default{
    bind(el) {
        let _this = el;
        el.addEventListener('input',()=>{
            let reg =new RegExp("[`~!@#$^&*()=|{}'_:;',\\\\[\\].<>\+\-/?~！@#‘’￥……&*（）——|{}【】‘；：”“'。，、？]")
            let value = _this.value;
            let str = '';
            for(var char of value){
                if(!reg.test(char)){
                    str += char;
                }
            }
            _this.value = str;
        })
    }
}
