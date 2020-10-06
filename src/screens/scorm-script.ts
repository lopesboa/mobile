export const INJECTED_JAVASCRIPT = /* javascript*/ `
    var callback = function(data) {
        alert(data)
    }
    // window.ReactNativeWebView.postMessage("Hello!")

    var MESSAGES = {
        SET_ITEM: 'setItem',
        GET_ITEM: 'getItem',
    };

    var DATABASE = {
        value: '',
    };

    // Android
    document.addEventListener('message', receiveMessage, false);
    // iOS
    window.addEventListener('message', receiveMessage, false);

    function receiveMessage(message) {
        // alert('message received from JS side');
        // alert(message.data);
    }

    function createMessage(type, key, data) {
    if (type === MESSAGES.SET_ITEM) {
        return JSON.stringify({
        type,
        data,
        });
    }
    if (type === MESSAGES.GET_ITEM) {
        return JSON.stringify({
        type,
        key,
        });
    }
    return JSON.stringify({
        type,
    });
    }
    // var message = createMessage(MESSAGES.GET_ITEM, 'varName', {});
    // alert(message);
    // window.ReactNativeWebView.postMessage(message);

    window.API = {};
    window.API_1484_11 = {};

    window.scormStatus = {
    lesson_status: '',
    score_raw: 0,
    score_max: 100,
    score_min: 0,
    session_time: 0,
    detailed_answers: {},
    };

    function getValue(key) {
    var varName = prefix + key;
    window.ReactNativeWebView.postMessage(createMessage(MESSAGES.GET_ITEM, varName));

    var value = DATABASE.value;

    if (key === 'cmi.student_preference.language') {
        return value || language;
    }

    if (value === null) {
        if (varName.includes('_count', this.length - '_count'.length)) {
        window.ReactNativeWebView.postMessage(createMessage(MESSAGES.SET_ITEM, varName, 0));
        return 0;
        } else {
        window.ReactNativeWebView.postMessage(createMessage(MESSAGES.SET_ITEM, varName, ''));
        return '';
        }
    }
    return value;
    }

    window.API.LMSInitialize = function () {
    alert('LMSInitialize');
    return true;
    };

    window.API.LMSTerminate = function () {
    alert('LMSTerminate');
    return true;
    };

    window.API.LMSGetValue = getValue;

    window.API.LMSSetValue = function (varname, varvalue) {
    varname = prefix + varname;

    var m = varname.match(/(\d+)\.cmi\.interactions\.(\d+)\.id/);
    if (m !== null) {
        window.ReactNativeWebView.postMessage(createMessage(MESSAGES.SET_ITEM, '{{scorm.id}}.cmi.interactions._count', parseInt(m[2]) + 1));
    }
    
    m = varname.match(/(\d+)\.cmi\.interactions\.(\d+)\.result/);
    if (m !== null) {
        window.ReactNativeWebView.postMessage(createMessage(MESSAGES.GET_ITEM, prefix + 'cmi.interactions.' + parseInt(m[2]) + '.id'));
        window.scormStatus.detailed_answers[key] = varvalue;
    }
    
    if (varname === prefix + 'cmi.core.lesson_status') window.scormStatus.lesson_status = varvalue;
    if (varname === prefix + 'cmi.core.score.raw') window.scormStatus.score_raw = varvalue;
    if (varname === prefix + 'cmi.core.score.max') window.scormStatus.score_max = varvalue;
    if (varname === prefix + 'cmi.core.score.min') window.scormStatus.score_min = varvalue;
    if (varname === prefix + 'cmi.core.session_time') window.scormStatus.session_time = varvalue;
    
    window.ReactNativeWebView.postMessage(createMessage(MESSAGES.SET_ITEM, varname, varvalue));

    return varvalue;
    };

    window.API.LMSCommit = function () {
    callback(window.scormStatus);
    return true;
    };

    window.API.LMSFinish = function () {
    alert('LMSFinish');
    return true;
    };

    window.API.LMSGetLastError = function () {
    alert('LMSGetLastError');
    return 0;
    };

    window.API.LMSGetErrorString = function () {
    alert('LMSGetErrorString');
    return '';
    };

    window.API.LMSGetDiagnostic = function () {
    alert('LMSGetDiagnostic');
    return '';
    };

    window.API_1484_11.Initialize = function () {
    alert('Initialize');
    return true;
    };

    window.API_1484_11.LMSTerminate = function () {
    alert('LMSTerminate');
    return true;
    };

    window.API_1484_11.GetValue = getValue;

    window.API_1484_11.SetValue = function (varname, varvalue) {
    varname = prefix + varname;

    var m = varname.match(/(\d+)\.cmi\.interactions\.(\d+)\.id/);
    if (m !== null) {
        window.ReactNativeWebView.postMessage(createMessage(MESSAGES.SET_ITEM, '{{scorm.id}}.cmi.interactions._count', parseInt(m[2]) + 1));
    }
    
    m = varname.match(/(\d+)\.cmi\.interactions\.(\d+)\.result/);
    if (m !== null) {
        window.ReactNativeWebView.postMessage(createMessage(MESSAGES.GET_ITEM, prefix + 'cmi.interactions.' + parseInt(m[2]) + '.id'));
        window.scormStatus.detailed_answers[key] = varvalue;
    }
    
    if (varname === prefix + 'cmi.core.lesson_status') window.scormStatus.lesson_status = varvalue;
    if (varname === prefix + 'cmi.core.score.raw') window.scormStatus.score_raw = varvalue;
    if (varname === prefix + 'cmi.core.score.max') window.scormStatus.score_max = varvalue;
    if (varname === prefix + 'cmi.core.score.min') window.scormStatus.score_min = varvalue;
    if (varname === prefix + 'cmi.core.session_time') window.scormStatus.session_time = varvalue;
    
    window.ReactNativeWebView.postMessage(createMessage(MESSAGES.SET_ITEM, varname, varvalue));
    return varvalue;
    };

    window.API_1484_11.Commit = function () {
    callback(window.scormStatus);
    return true;
    };

    window.API_1484_11.Terminate = function () {
    alert('Terminate');
    return true;
    };

    window.API_1484_11.GetLastError = function () {
    alert('GetLastError');
    return 0;
    };

    window.API_1484_11.GetErrorString = function () {
    alert('GetErrorString');
    return '';
    };

    window.API_1484_11.GetDiagnostic = function () {
    alert('GetDiagnostic');
    return '';
    };

    false;
`;
