import Controller from '@ember/controller';

export default Controller.extend({
    actions:{
        addTodo(){
            var date = this.get('date');
            var title = this.get('title');
            var body = this.get('body');

            // check null:
            if(date && title && body){
                // Create new toDo instance.
                var newTodo = this.store.createRecord('todo',{
                    title: title,
                    date: new Date(date),
                    body: body
                })
                
                // Save to DB
                newTodo.save();

                // Clear form
                this.setProperties({
                    title:'',
                    body: ''
                });
            }
            else{
                alert("Please fulfill the form! :)")
            }

        }
    }
});
