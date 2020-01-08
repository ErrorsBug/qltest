
// 列表页tab切换头部
/**
 *  
    loadListTab=(this,"topic",[{
            tab:"topic",
            tabName:"课程",
            tabIcon:"",
            tabIconAction:""
        },
        {
            tab:"channel",
            tabName:"系列课",
            tabIcon: __uri("/comp/load-list-bar/img/channel-tab.png"),
            tabIconAction: __uri("/comp/load-list-bar/img/channel-activetab.png")
        }]);
 * 
 * 
 */

export const  loadListTab=(thisli,thistab,listtabs)=>{
    listtabs=listtabs||[
        {
            tab:"channel",
            tabName:"系列课",
            tabIcon: "",
            tabIconAction:""
        },
        {
            tab: "topic",
            tabName: "课程",
            tabIcon: "",
            tabIconAction: ""
        },
    ];
    // 列表tab初始化
    thisli.setData({
        listTabs:listtabs,
        listKey:thistab
    });

    thisli.bindListTab=(e)=>{
        const targer=e.currentTarget;
        if(targer.dataset.type!=thistab){
            thistab=targer.dataset.type;
            thisli.setData({
                listKey:thistab
            });
        };
    };
};
