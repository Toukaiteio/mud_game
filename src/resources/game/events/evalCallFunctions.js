//For now this just for mod judge values,and you can create window through this by using document.createElement 
//20231104:Not done yet.Still Working on this.
function ModInitializer(TotalGameAPI){
    const { PlayerStatus }=TotalGameAPI;
    return {
        ExampleModFunction(){
            //This ExampleFunction Wont call in Game Process,just for a example.
            return PlayerStatus.HP>30;
        },
    }
}

