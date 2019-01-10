import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    body: DS.attr('string'),
    date: DS.attr('date'),
    created_at: DS.attr('string',{
        defaultValue: function(){
            return new Date();
        } 
    })
});
