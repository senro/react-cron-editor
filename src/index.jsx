'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import LANG from './i18n';

const Options = require('./options');
const MonthOptions = Options.MonthOptions;
const WeekOptions = Options.WeekOptions;
const FirstToLastOptions = Options.FirstToLastOptions;
const DayOptions = Options.DayOptions;
const MonthDayOptions = Options.MonthDayOptions;
const MonthNumOptions = Options.MonthNumOptions;
const HourOptions = Options.HourOptions;
const MinOrSecondOptions = Options.MinOrSecondOptions;

const defaultModel={
    type: 'Minutes',
    Minutes: {
        minute: '0',
        second: '0',
    },
    Hourly: {
        hour: '1',
        minute: '0',
        second: '0',
    },
    Daily: {
        current:'option1',
        option1:{
            day:'1',
            hour: '1',
            minute: '0',
            second: '0',
        },
        option2:{
            hour: '1',
            minute: '0',
            second: '0',
        }
    },
    Weekly:{
        days:{
            MON:true,
            TUE:false,
            WED:false,
            THU:false,
            FRI:false,
            SAT:false,
            SUN:false,
        },
        hour: '1',
        minute: '0',
        second: '0',
    },
    Monthly:{
        current:'option1',
        option1:{
            month:'1',
            day:'1',
            hour: '1',
            minute: '0',
            second: '0',
        },
        option2:{
            num:'#1',
            week:'MON',
            month:'1',
            hour: '1',
            minute: '0',
            second: '0',
        }
    },
    Yearly:{
        current:'option1',
        option1:{
            month:'1',
            day:'1',
            hour: '1',
            minute: '0',
            second: '0',
        },
        option2:{
            num:'#1',
            week:'MON',
            month:'1',
            hour: '1',
            minute: '0',
            second: '0',
        }
    },
    Advanced:{
        exp:'0 15 10 L-2 * ?'
    }
};

export default class CronEditor extends React.Component {
    handleInputChange = () => {
        let currentExp='';
        if(this.state.type === 'Minutes'){
            currentExp=`${this.state.Minutes.second} 0/${this.state.Minutes.minute} * 1/1 * ? *`;
        }else if(this.state.type === 'Hourly'){
            currentExp=`${this.state.Hourly.second} ${this.state.Hourly.minute} 0/${this.state.Hourly.hour} 1/1 * ? *`;
        }else if(this.state.type === 'Daily'){
            if(this.state.Daily.current==='option1'){
                currentExp=`${this.state.Daily.option1.second} ${this.state.Daily.option1.minute} ${this.state.Daily.option1.hour} 1/${this.state.Daily.option1.day} * ? *`;
            }else if(this.state.Daily.current==='option2'){
                currentExp=`${this.state.Daily.option2.second} ${this.state.Daily.option2.minute} ${this.state.Daily.option2.hour} ? * MON-FRI *`;
            }
        }else if(this.state.type === 'Weekly'){
            currentExp=`${this.state.Weekly.second} ${this.state.Weekly.minute} ${this.state.Weekly.hour} ? * ${Object.keys(this.state.Weekly.days).filter(key=>this.state.Weekly.days[key]).join(',')} *`;
        }else if(this.state.type === 'Monthly'){
            if(this.state.Monthly.current==='option1'){
                currentExp=`${this.state.Monthly.option1.second} ${this.state.Monthly.option1.minute} ${this.state.Monthly.option1.hour} ${this.state.Monthly.option1.day} 1/${this.state.Monthly.option1.month} ? *`;
            }else if(this.state.Monthly.current==='option2'){
                currentExp=`${this.state.Monthly.option2.second} ${this.state.Monthly.option2.minute} ${this.state.Monthly.option2.hour} ? 1/${this.state.Monthly.option2.month} ${this.state.Monthly.option2.week}${this.state.Monthly.option2.num} *`;
            }
        }else if(this.state.type === 'Yearly'){
            if(this.state.Yearly.current==='option1'){
                currentExp=`${this.state.Yearly.option1.second} ${this.state.Yearly.option1.minute} ${this.state.Yearly.option1.hour} ${this.state.Yearly.option1.day} ${this.state.Yearly.option1.month} ? *`;
            }else if(this.state.Yearly.current==='option2'){
                currentExp=`${this.state.Yearly.option2.second} ${this.state.Yearly.option2.minute} ${this.state.Yearly.option2.hour} ? ${this.state.Yearly.option2.month} ${this.state.Yearly.option2.week}${this.state.Yearly.option2.num} *`;
            }
        }else if(this.state.type === 'Advanced'){
            currentExp=this.state.Advanced.exp;
        }

        this.props.onChange&&this.props.onChange(currentExp);
    };
    parseValue=(props)=>{
        let minOrSecRegStr='((^[0-9]$)|(^[1-5][0-9]$))';//0-59
        let minOrSecRegMiddleStr='([0-9]|[1-5][0-9])';//字符中间的0-59
        let hourRegStr='((^[1-9]$)|(^1[0-9]$)|(^2[0-3]$))';//1-23
        let hourRegMiddleStr='([1-9]|1[0-9]|2[0-3])';//字符中间的1-23
        let dayRegStr='((^[1-9]$)|(^1[0-9]$)|(^2[0-9]$)|(^3[0-1]$))';//1-31
        let dayRegMiddleStr='([1-9]|1[0-9]|2[0-9]|3[0-1])';//字符中间的1-31
        let workdayRegStr='1W|LW|L|((^[1-9]$)|(^1[0-9]$)|(^2[0-9]$)|(^3[0-1]$))';//1W|LW|L|1-31
        let monthRegStr='((^[1-9]$)|(^1[0-2]$))';//1-12
        let monthRegMiddleStr='([1-9]|1[0-2])';//字符中间的1-12
        let weekRegStr='(^$|^(MON|TUE|WED|THU|FRI|SAT|SUN)(\\,(MON|TUE|WED|THU|FRI|SAT|SUN)){0,6}$)';//MON,TUE,WED,THU,FRI,SAT,SUN组合
        let weekNumRegStr='^(MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L)$';//MON,TUE,WED,THU,FRI,SAT,SUN#1|L 组合
        let Reg_Minutes=`${minOrSecRegStr} 0\\/${minOrSecRegMiddleStr} \\* 1\\/1 \\* \\? \\*`;
        let Reg_Hourly=`${minOrSecRegStr} ${minOrSecRegStr} 0\\/${hourRegMiddleStr} 1\\/1 \\* \\? \\*`;
        let Reg_Daily_option1=`${minOrSecRegStr} ${minOrSecRegStr} ${hourRegStr} 1\\/${dayRegMiddleStr} \\* \\? \\*`;
        let Reg_Daily_option2=`${minOrSecRegStr} ${minOrSecRegStr} ${hourRegStr} \\? \\* MON\\-FRI \\*`;
        let Reg_Weekly=`${minOrSecRegStr} ${minOrSecRegStr} ${hourRegStr} \\? \\* ${weekRegStr} \\*`;
        let Reg_Monthly_option1=`${minOrSecRegStr} ${minOrSecRegStr} ${hourRegStr} ${workdayRegStr} 1\\/${monthRegMiddleStr} \\? \\*`;
        let Reg_Monthly_option2=`${minOrSecRegStr} ${minOrSecRegStr} ${hourRegStr} \\? 1\\/${monthRegMiddleStr} ${weekNumRegStr} \\*`;
        let Reg_Yearly_option1=`${minOrSecRegStr} ${minOrSecRegStr} ${hourRegStr} ${workdayRegStr} ${monthRegStr} \\? \\*`;
        let Reg_Yearly_option2=`${minOrSecRegStr} ${minOrSecRegStr} ${hourRegStr} \\? ${monthRegStr} ${weekNumRegStr} \\*`;

        let value=props.value;
        if(!value){
            return;
        }
        let valueArray=value.split(' ');

        if(this.runRegStr(Reg_Minutes,valueArray)){
            this.setState({
                type: 'Minutes',
                Minutes:{
                    minute: valueArray[1].split('/')[1],
                    second: valueArray[0],
                }
            });
        }else if(this.runRegStr(Reg_Hourly,valueArray)){
            this.setState({
                type: 'Hourly',
                Hourly:{
                    hour: valueArray[2].split('/')[1],
                    minute: valueArray[1],
                    second: valueArray[0],
                }
            });
        }else if(this.runRegStr(Reg_Daily_option1,valueArray)){
            this.setState({
                type: 'Daily',
                Daily:{
                    current:'option1',
                    option1:{
                        day: valueArray[3].split('/')[1],
                        hour: valueArray[2],
                        minute: valueArray[1],
                        second: valueArray[0],
                    },
                    option2:this.state.Daily.option2
                }
            });
        }else if(this.runRegStr(Reg_Daily_option2,valueArray)){
            this.setState({
                type: 'Daily',
                Daily:{
                    current:'option2',
                    option1:this.state.Daily.option1,
                    option2:{
                        hour: valueArray[2],
                        minute: valueArray[1],
                        second: valueArray[0],
                    }
                }
            });
        }else if(this.runRegStr(Reg_Weekly,valueArray)){
            this.setState({
                type: 'Weekly',
                Weekly:{
                    days:{
                        MON:valueArray[5].indexOf('MON')!=-1?true:false,
                        TUE:valueArray[5].indexOf('TUE')!=-1?true:false,
                        WED:valueArray[5].indexOf('WED')!=-1?true:false,
                        THU:valueArray[5].indexOf('THU')!=-1?true:false,
                        FRI:valueArray[5].indexOf('FRI')!=-1?true:false,
                        SAT:valueArray[5].indexOf('SAT')!=-1?true:false,
                        SUN:valueArray[5].indexOf('SUN')!=-1?true:false,
                    },
                    hour: valueArray[2],
                    minute: valueArray[1],
                    second: valueArray[0],
                }
            });
        }else if(this.runRegStr(Reg_Monthly_option1,valueArray)){
            this.setState({
                type: 'Monthly',
                Monthly:{
                    current:'option1',
                    option1:{
                        month:valueArray[4].split('/')[1],
                        day:valueArray[3],
                        hour: valueArray[2],
                        minute: valueArray[1],
                        second: valueArray[0],
                    },
                    option2:this.state.Monthly.option2
                }
            });
        }else if(this.runRegStr(Reg_Monthly_option2,valueArray)){
            this.setState({
                type: 'Monthly',
                Monthly:{
                    current:'option2',
                    option1:this.state.Monthly.option1,
                    option2:{
                        num:/#/.test(valueArray[5])?valueArray[5].split('#')[1]:valueArray[5].substr(3,valueArray[5].length),
                        week:/#/.test(valueArray[5])?valueArray[5].split('#')[0]:valueArray[5].substr(0,3),
                        month:valueArray[4].split('/')[1],
                        hour: valueArray[2],
                        minute: valueArray[1],
                        second: valueArray[0],
                    },
                }
            });
        }else if(this.runRegStr(Reg_Yearly_option1,valueArray)){
            this.setState({
                type: 'Yearly',
                Yearly:{
                    current:'option1',
                    option1:{
                        month:valueArray[4],
                        day: valueArray[3].split('/')[1],
                        hour: valueArray[2],
                        minute: valueArray[1],
                        second: valueArray[0],
                    },
                    option2:this.state.Monthly.option2
                }
            });
        }else if(this.runRegStr(Reg_Yearly_option2,valueArray)){
            this.setState({
                type: 'Yearly',
                Yearly:{
                    current:'option2',
                    option1:this.state.Monthly.option1,
                    option2:{
                        num:/#/.test(valueArray[5])?valueArray[5].split('#')[1]:valueArray[5].substr(3,valueArray[5].length),
                        week:/#/.test(valueArray[5])?valueArray[5].split('#')[0]:valueArray[5].substr(0,3),
                        month:valueArray[4],
                        hour: valueArray[2],
                        minute: valueArray[1],
                        second: valueArray[0],
                    },
                }
            });
        }else{
            this.setState({
                type: 'Advanced',
                Advanced:{
                    exp:value,
                }
            });
        }
    };
    runRegStr=(regStr,valueArray)=>{
        let result=regStr.split(' ').filter((regString,i)=>{
            if(regString&&new RegExp(regString).test(valueArray[i])){
                return true;
            }
            return false;
        });

        if(result.length==7){
            return true;
        }
        return false;
    };
    handleBlur=()=>{
        //console.log('cron-editor->handleBlur')
        this.props.onBlur&&this.props.onBlur(this.props.value);
    };
    handleInput = (e, attr, callback) => {
        //console.log('cron-editor->handleInput')
        let _this = this;
        let value;

        if (!attr) {
            let event = e;
            let elem = event.target;
            value = elem.value;
            if (elem.attributes['data-model'] != null) {
                attr = elem.dataset.model;
            }
        } else {//select 直接传值
            value = e;
        }

        if (attr) {
            this.setArrayDescendantProp(this.state, attr, value);
        }

        callback && callback();
    };
    setArrayDescendantProp = (obj, desc, value) => {
        desc = desc.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        desc = desc.replace(/^\./, ''); // strip leading dot
        // Split the path to an array and assaign the object
        // to a local variable
        let descArray = desc.split('.');

        // Iterate over the paths, skipping the last one
        for (var i = 0; i < descArray.length - 1; i++) {
            // Grab the next path's value, creating an empty
            // object if it does not exist
            obj = (obj[descArray[i]]) ? obj[descArray[i]] : obj[descArray[i]] = {};
        }

        // Assign the value to the object's last path
        obj[descArray[descArray.length - 1]] = value;
        this.setState(obj);
    };
    reset=()=>{
        this.setState(defaultModel);
    };
    static propTypes = {
        lang: PropTypes.string,
    };

    static defaultProps = {
        lang: 'zh'
    };

    constructor(props) {
        super(props);

        this.state = defaultModel;

        if(!this.props.value){
            this.handleInputChange();
        }
    }

    componentDidMount() {
        this.parseValue(this.props);
    };

    componentWillReceiveProps(nextProps){
        this.parseValue(nextProps);
    }

    render() {
        const lang=this.props.lang;
        return (
            <div onBlur={this.handleBlur}>
                <div className="tabBtns">
                    <a
                        href="javascript:;"
                        className={"tabBtn " + (this.state.type === 'Minutes' ? 'tabBtn_hover' : '')}
                        onClick={() => this.handleInput('Minutes','type',this.handleInputChange)}
                    >
                        {
                            LANG[lang]['tabName.Minutes']
                        }
                    </a>
                    <a
                        href="javascript:;"
                        className={"tabBtn " + (this.state.type === 'Hourly' ? 'tabBtn_hover' : '')}
                        onClick={() => this.handleInput('Hourly','type',this.handleInputChange)}>
                        {
                            LANG[lang]['tabName.Hourly']
                        }
                    </a>
                    <a
                        href="javascript:;"
                        className={"tabBtn " + (this.state.type === 'Daily' ? 'tabBtn_hover' : '')}
                        onClick={() => this.handleInput('Daily','type',this.handleInputChange)}>
                        {
                            LANG[lang]['tabName.Daily']
                        }
                    </a>
                    <a
                        href="javascript:;"
                        className={"tabBtn " + (this.state.type === 'Weekly' ? 'tabBtn_hover' : '')}
                        onClick={() => this.handleInput('Weekly','type',this.handleInputChange)}>
                        {
                            LANG[lang]['tabName.Weekly']
                        }
                    </a>
                    <a
                        href="javascript:;"
                        className={"tabBtn " + (this.state.type === 'Monthly' ? 'tabBtn_hover' : '')}
                        onClick={() => this.handleInput('Monthly','type',this.handleInputChange)}>
                        {
                            LANG[lang]['tabName.Monthly']
                        }
                    </a>
                    <a
                        href="javascript:;"
                        className={"tabBtn " + (this.state.type === 'Yearly' ? 'tabBtn_hover' : '')}
                        onClick={() => this.handleInput('Yearly','type',this.handleInputChange)}>
                        {
                            LANG[lang]['tabName.Yearly']
                        }
                    </a>
                    <a
                        href="javascript:;"
                        className={"tabBtn " + (this.state.type === 'Advanced' ? 'tabBtn_hover' : '')}
                        onClick={() => this.handleInput('Advanced','type',this.handleInputChange)}>
                        {
                            LANG[lang]['tabName.Advanced']
                        }
                    </a>
                </div>
                <div className="tabConts">
                    <div
                        className="tabCont"
                        style={{display: this.state.type === 'Minutes' ? 'block' : 'none'}}
                    >
                        <span className="text">
                            {
                                LANG[lang]['text.Every']
                            }
                        </span>
                        <select
                            value={this.state.Minutes.minute}
                            onChange={(e) => this.handleInput(e.target.value, 'Minutes.minute', this.handleInputChange)}
                        >
                            {
                                MinOrSecondOptions()
                            }
                        </select>
                        <span className="text">
                            {
                                LANG[lang]['text.minute']
                            }
                        </span>
                        <select
                            value={this.state.Minutes.second}
                            onChange={(e) => this.handleInput(e.target.value, 'Minutes.second', this.handleInputChange)}
                        >
                            {
                                MinOrSecondOptions()
                            }
                        </select>
                        <span className="text">
                            {
                                LANG[lang]['text.second']
                            }
                        </span>
                    </div>
                    <div
                        className="tabCont"
                        style={{display: this.state.type === 'Hourly' ? 'block' : 'none'}}
                    >
                        <span className="text">
                            {
                                LANG[lang]['text.Every']
                            }
                        </span>
                        <select
                            value={this.state.Hourly.hour}
                            onChange={(e) => this.handleInput(e.target.value, 'Hourly.hour', this.handleInputChange)}
                        >
                            {
                                HourOptions('1-23')
                            }
                        </select>
                        <span className="text">
                            {
                                LANG[lang]['text.hour']
                            }
                        </span>
                        <select
                            value={this.state.Hourly.minute}
                            onChange={(e) => this.handleInput(e.target.value, 'Hourly.minute', this.handleInputChange)}
                        >
                            {
                                MinOrSecondOptions()
                            }
                        </select>
                        <span className="text">
                            {
                                LANG[lang]['text.minute']
                            }
                        </span>
                        <select
                            value={this.state.Hourly.second}
                            onChange={(e) => this.handleInput(e.target.value, 'Hourly.second', this.handleInputChange)}
                        >
                            {
                                MinOrSecondOptions()
                            }
                        </select>
                        <span className="text">
                            {
                                LANG[lang]['text.second']
                            }
                        </span>
                    </div>
                    <div
                        className="tabCont"
                        style={{display: this.state.type === 'Daily' ? 'block' : 'none'}}
                    >
                        <label>
                            <input
                                checked={this.state.Daily.current==='option1'}
                                onChange={(e) => this.handleInput(e.target.checked?'option1':'', 'Daily.current', this.handleInputChange)}
                                type="radio"
                                name="Daily"
                            />
                            <span className="text">
                                {
                                    LANG[lang]['text.Every']
                                }
                            </span>
                            <select
                                value={this.state.Daily.option1.hour}
                                onChange={(e) => this.handleInput(e.target.value, 'Daily.option1.hour', this.handleInputChange)}
                            >
                                {
                                    MonthDayOptions()
                                }
                            </select>
                            <span className="text">
                                {
                                    LANG[lang]['text.day(s)_at']
                                }
                            </span>
                            <select
                                value={this.state.Daily.option1.hour}
                                onChange={(e) => this.handleInput(e.target.value, 'Daily.option1.hour', this.handleInputChange)}
                            >
                                {
                                    HourOptions()
                                }
                            </select>
                            <select
                                value={this.state.Daily.option1.minute}
                                onChange={(e) => this.handleInput(e.target.value, 'Daily.option1.minute', this.handleInputChange)}
                            >
                                {
                                    MinOrSecondOptions()
                                }
                            </select>
                            <select
                                value={this.state.Daily.option1.second}
                                onChange={(e) => this.handleInput(e.target.value, 'Daily.option1.second', this.handleInputChange)}
                            >
                                {
                                    MinOrSecondOptions()
                                }
                            </select>
                        </label>
                        <br/>
                        <label>
                            <input
                                checked={this.state.Daily.current==='option2'}
                                onChange={(e) => this.handleInput(e.target.checked?'option2':'', 'Daily.current', this.handleInputChange)}
                                type="radio"
                                name="Daily"
                            />
                            <span className="text">
                                {
                                    LANG[lang]['text.every_working_day_at']
                                }
                            </span>
                            <select
                                value={this.state.Daily.option2.hour}
                                onChange={(e) => this.handleInput(e.target.value, 'Daily.option2.hour', this.handleInputChange)}
                            >
                                {
                                    HourOptions()
                                }
                            </select>
                            <select
                                value={this.state.Daily.option2.hour}
                                onChange={(e) => this.handleInput(e.target.value, 'Daily.option2.minute', this.handleInputChange)}
                            >
                                {
                                    MinOrSecondOptions()
                                }
                            </select>
                            <select
                                value={this.state.Daily.option2.hour}
                                onChange={(e) => this.handleInput(e.target.value, 'Daily.option2.second', this.handleInputChange)}
                            >
                                {
                                    MinOrSecondOptions()
                                }
                            </select>
                        </label>
                    </div>
                    <div
                        className="tabCont tabCont-weekly"
                        style={{display: this.state.type === 'Weekly' ? 'block' : 'none'}}
                    >
                        <label>
                            <input
                                checked={this.state.Weekly.days.MON}
                                onChange={(e) => this.handleInput(Boolean(e.target.checked), 'Weekly.days.MON', this.handleInputChange)}
                                type="checkbox"
                                name="Weekly.Monday"
                            />
                            {
                                LANG[lang]['text.Monday']
                            }
                        </label>
                        <label>
                            <input
                                checked={this.state.Weekly.days.TUE}
                                onChange={(e) => this.handleInput(Boolean(e.target.checked), 'Weekly.days.TUE', this.handleInputChange)}
                                type="checkbox"
                                name="Weekly.Tuesday"
                            />
                            {
                                LANG[lang]['text.Tuesday']
                            }
                        </label>
                        <label>
                            <input
                                checked={this.state.Weekly.days.WED}
                                onChange={(e) => this.handleInput(Boolean(e.target.checked), 'Weekly.days.WED', this.handleInputChange)}
                                type="checkbox"
                                name="Weekly.Wednesday"
                            />
                            {
                                LANG[lang]['text.Wednesday']
                            }
                        </label>
                        <label>
                            <input
                                checked={this.state.Weekly.days.THU}
                                onChange={(e) => this.handleInput(Boolean(e.target.checked), 'Weekly.days.THU', this.handleInputChange)}
                                type="checkbox"
                                name="Weekly.Thursday"
                            />
                            {
                                LANG[lang]['text.Thursday']
                            }
                        </label>
                        <label>
                            <input
                                checked={this.state.Weekly.days.FRI}
                                onChange={(e) => this.handleInput(Boolean(e.target.checked), 'Weekly.days.FRI', this.handleInputChange)}
                                type="checkbox"
                                name="Weekly.Friday"
                            />
                            {
                                LANG[lang]['text.Friday']
                            }
                        </label>
                        <label>
                            <input
                                checked={this.state.Weekly.days.SAT}
                                onChange={(e) => this.handleInput(Boolean(e.target.checked), 'Weekly.days.SAT', this.handleInputChange)}
                                type="checkbox"
                                name="Weekly.Saturday"
                            />
                            {
                                LANG[lang]['text.Saturday']
                            }
                        </label>
                        <label>
                            <input
                                checked={this.state.Weekly.days.SUN}
                                onChange={(e) => this.handleInput(Boolean(e.target.checked), 'Weekly.days.SUN', this.handleInputChange)}
                                type="checkbox"
                                name="Weekly.Sunday"
                            />
                            {
                                LANG[lang]['text.Sunday']
                            }
                        </label>
                        <br/>
                        <span className="text">
                            {
                                LANG[lang]['text.at']
                            }
                        </span>
                        <select
                            value={this.state.Weekly.hour}
                            onChange={(e) => this.handleInput(e.target.value, 'Weekly.hour', this.handleInputChange)}
                        >
                            {
                                HourOptions()
                            }
                        </select>
                        <select
                            value={this.state.Weekly.minute}
                            onChange={(e) => this.handleInput(e.target.value, 'Weekly.minute', this.handleInputChange)}
                        >
                            {
                                MinOrSecondOptions()
                            }
                        </select>
                        <select
                            value={this.state.Weekly.second}
                            onChange={(e) => this.handleInput(e.target.value, 'Weekly.second', this.handleInputChange)}
                        >
                            {
                                MinOrSecondOptions()
                            }
                        </select>
                    </div>
                    <div
                        className="tabCont"
                        style={{display: this.state.type === 'Monthly' ? 'block' : 'none'}}
                    >
                        <label>
                            <input
                                type="radio"
                                name="Monthly"
                                checked={this.state.Monthly.current==='option1'}
                                onChange={(e) => this.handleInput(e.target.checked?'option1':'', 'Monthly.current', this.handleInputChange)}
                            />
                            <span className="text">
                                {
                                    LANG[lang]['text.On_the']
                                }
                            </span>
                            <select
                                value={this.state.Monthly.option1.day}
                                onChange={(e) => this.handleInput(e.target.value, 'Monthly.option1.day', this.handleInputChange)}
                            >
                                {
                                    DayOptions(lang)
                                }
                            </select>
                            <span className="text">
                                {
                                    LANG[lang]['text.of_every']
                                }
                            </span>
                            <select
                                value={this.state.Monthly.option1.month}
                                onChange={(e) => this.handleInput(e.target.value, 'Monthly.option1.month', this.handleInputChange)}
                            >
                                {
                                    MonthNumOptions()
                                }
                            </select>
                            <span className="text">
                                {
                                    LANG[lang]['text.month(s)_at']
                                }
                            </span>
                            <select
                                value={this.state.Monthly.option1.hour}
                                onChange={(e) => this.handleInput(e.target.value, 'Monthly.option1.hour', this.handleInputChange)}
                            >
                                {
                                    HourOptions()
                                }
                            </select>
                            <select
                                value={this.state.Monthly.option1.minute}
                                onChange={(e) => this.handleInput(e.target.value, 'Monthly.option1.minute', this.handleInputChange)}
                            >
                                {
                                    MinOrSecondOptions()
                                }
                            </select>
                            <select
                                value={this.state.Monthly.option1.second}
                                onChange={(e) => this.handleInput(e.target.value, 'Monthly.option1.second', this.handleInputChange)}
                            >
                                {
                                    MinOrSecondOptions()
                                }
                            </select>
                        </label>
                        <br/>
                        <label>
                            <input
                                checked={this.state.Monthly.current==='option2'}
                                onChange={(e) => this.handleInput(e.target.checked?'option2':'', 'Monthly.current', this.handleInputChange)}
                                type="radio"
                                name="Monthly"
                            />
                            <span className="text">
                                {
                                    LANG[lang]['text.On_the']
                                }
                            </span>
                            <select
                                value={this.state.Monthly.option2.num}
                                onChange={(e) => this.handleInput(e.target.value, 'Monthly.option2.num', this.handleInputChange)}
                            >
                                {
                                    FirstToLastOptions(lang)
                                }
                            </select>
                            <select
                                value={this.state.Monthly.option2.week}
                                onChange={(e) => this.handleInput(e.target.value, 'Monthly.option2.week', this.handleInputChange)}
                            >
                                {
                                    WeekOptions(lang)
                                }
                            </select>
                            <span className="text">
                                {
                                    LANG[lang]['text.of_every']
                                }
                            </span>
                            <select
                                value={this.state.Monthly.option2.month}
                                onChange={(e) => this.handleInput(e.target.value, 'Monthly.option2.month', this.handleInputChange)}
                            >
                                {
                                    MonthNumOptions()
                                }
                            </select>
                            <span className="text">
                                {
                                    LANG[lang]['text.month(s)_at']
                                }
                            </span>
                            <select
                                value={this.state.Monthly.option2.hour}
                                onChange={(e) => this.handleInput(e.target.value, 'Monthly.option2.hour', this.handleInputChange)}
                            >
                                {
                                    HourOptions()
                                }
                            </select>
                            <select
                                value={this.state.Monthly.option2.minute}
                                onChange={(e) => this.handleInput(e.target.value, 'Monthly.option2.minute', this.handleInputChange)}
                            >
                                {
                                    MinOrSecondOptions()
                                }
                            </select>
                            <select
                                value={this.state.Monthly.option2.second}
                                onChange={(e) => this.handleInput(e.target.value, 'Monthly.option2.second', this.handleInputChange)}
                            >
                                {
                                    MinOrSecondOptions()
                                }
                            </select>
                        </label>
                    </div>
                    <div
                        className="tabCont"
                        style={{display: this.state.type === 'Yearly' ? 'block' : 'none'}}
                    >
                        <label>
                            <input
                                type="radio"
                                name="Yearly"
                                checked={this.state.Yearly.current==='option1'}
                                onChange={(e) => this.handleInput(e.target.checked?'option1':'', 'Yearly.current', this.handleInputChange)}
                            />
                            <span className="text">
                                {
                                    LANG[lang]['text.Every']
                                }
                            </span>
                            <select
                                value={this.state.Yearly.option1.month}
                                onChange={(e) => this.handleInput(e.target.value, 'Yearly.option1.month', this.handleInputChange)}
                            >
                                {
                                    MonthOptions(lang)
                                }
                            </select>
                            <span className="text">
                                {
                                    LANG[lang]['text.On_the']
                                }
                            </span>
                            <select
                                value={this.state.Yearly.option1.day}
                                onChange={(e) => this.handleInput(e.target.value, 'Yearly.option1.day', this.handleInputChange)}
                            >
                                {
                                    DayOptions(lang)
                                }
                            </select>
                            <span className="text">
                                {
                                    LANG[lang]['text.at']
                                }
                            </span>
                            <select
                                value={this.state.Yearly.option1.hour}
                                onChange={(e) => this.handleInput(e.target.value, 'Yearly.option1.hour', this.handleInputChange)}
                            >
                                {
                                    HourOptions()
                                }
                            </select>
                            <select
                                value={this.state.Yearly.option1.minute}
                                onChange={(e) => this.handleInput(e.target.value, 'Yearly.option1.minute', this.handleInputChange)}
                            >
                                {
                                    MinOrSecondOptions()
                                }
                            </select>
                            <select
                                value={this.state.Yearly.option1.second}
                                onChange={(e) => this.handleInput(e.target.value, 'Yearly.option1.second', this.handleInputChange)}
                            >
                                {
                                    MinOrSecondOptions()
                                }
                            </select>
                        </label>
                        <br/>
                        <label>
                            <input
                                type="radio"
                                name="Yearly"
                                checked={this.state.Yearly.current==='option2'}
                                onChange={(e) => this.handleInput(e.target.checked?'option2':'', 'Yearly.current', this.handleInputChange)}
                            />
                            <span className="text">
                                {
                                    LANG[lang]['text.On_the']
                                }
                            </span>
                            <select
                                value={this.state.Yearly.option2.num}
                                onChange={(e) => this.handleInput(e.target.value, 'Yearly.option2.num', this.handleInputChange)}
                            >
                                {
                                    FirstToLastOptions(lang)
                                }
                            </select>
                            <select
                                value={this.state.Yearly.option2.week}
                                onChange={(e) => this.handleInput(e.target.value, 'Yearly.option2.week', this.handleInputChange)}
                            >
                                {
                                    WeekOptions(lang)
                                }
                            </select>
                            <span className="text">
                                {
                                    LANG[lang]['text.of']
                                }
                            </span>
                            <select
                                value={this.state.Yearly.option2.month}
                                onChange={(e) => this.handleInput(e.target.value, 'Yearly.option2.month', this.handleInputChange)}
                            >
                                {
                                    MonthOptions(lang)
                                }
                            </select>
                            <span className="text">
                                {
                                    LANG[lang]['text.at']
                                }
                            </span>
                            <select
                                value={this.state.Yearly.option2.hour}
                                onChange={(e) => this.handleInput(e.target.value, 'Yearly.option2.hour', this.handleInputChange)}
                            >
                                {
                                    HourOptions()
                                }
                            </select>
                            <select
                                value={this.state.Yearly.option2.minute}
                                onChange={(e) => this.handleInput(e.target.value, 'Yearly.option2.minute', this.handleInputChange)}
                            >
                                {
                                    MinOrSecondOptions()
                                }
                            </select>
                            <select
                                value={this.state.Yearly.option2.second}
                                onChange={(e) => this.handleInput(e.target.value, 'Yearly.option2.second', this.handleInputChange)}
                            >
                                {
                                    MinOrSecondOptions()
                                }
                            </select>
                        </label>
                    </div>
                    <div
                        className="tabCont"
                        style={{display: this.state.type === 'Advanced' ? 'block' : 'none'}}
                    >
                        <span className="text">
                            {
                                LANG[lang]['text.Cron_Expression']
                            }
                        </span>
                        <input
                            value={this.state.Advanced.exp}
                            onChange={(e) => this.handleInput(e.target.value, 'Advanced.exp', this.handleInputChange)}
                            className="input-customExp"
                            type="text"
                        />
                    </div>
                    <div className="preview">
                        <span className="text">
                            {
                                LANG[lang]['text.preview']
                            }
                            :
                        </span>
                        <code className="exp">
                            {
                                this.props.value
                            }
                        </code>
                    </div>
                </div>

            </div>
        );
    }
};