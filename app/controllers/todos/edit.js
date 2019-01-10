import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        editTodo(id){
            var self = this;

            var title = this.get('model.title');
            var body = this.get('model.body');
            var date = this.get('model.date');

            this.store.findRecord('todo',id).then(function(todo){
                todo.set('title',title);
                todo.set('body',body);
                todo.set('date',new Date(date));

                // save to DB:
                todo.save();
                
                // go back
                self.transitionToRoute('todos');
            })

        },
        deleteTodo(id){
            var self = this;
            this.store.findRecord('todo',id).then(function(todo){
                todo.deleteRecord();

                // Save to DB
                todo.save();

                // go back
                self.transitionToRoute('todos');   
            })
        }
    }
});
