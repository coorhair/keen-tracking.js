
import Keen from '../../../../lib/server';
import config from '../helpers/client-config';

describe('.extendEvent(s) methods', function() {

  beforeEach(function() {
    Keen.enabled = false;
    Keen.debug = true;
    this.client = new Keen({
      projectId: config.projectId,
      writeKey: config.writeKey,
      requestType: 'xhr',
      host: config.host,
      protocol: config.protocol
    });
  });

  it('should have an extensions hash with "events" and "collections" queues', () => {
    expect().isObject(this.client.extensions);
    expect().isArray(this.client.extensions.events);
    expect().isObject(this.client.extensions.collections);
  });

  it('should store global extensions in the proper order', () => {
    this.client.extendEvents({ key: 123 });
    this.client.extendEvents(() => { return {} });
    this.client.extendEvents({ key: 456 });

    expect().isObject(this.client.extensions.events[0]);
    expect().equal(this.client.extensions.events[0].key, 123);
    expect().isFunction(this.client.extensions.events[1]);
    expect().isObject(this.client.extensions.events[2]);
    expect().equal(this.client.extensions.events[2].key, 456);
  });

  it('should store single collection extensions in the proper order', () => {
    this.client.extendEvent('pageviews', { key: 123 });
    this.client.extendEvent('pageviews', () => { return {} });
    this.client.extendEvent('pageviews', { key: 456 });

    this.client.extendEvent('purchases', { key: 123 });
    this.client.extendEvent('purchases', () => { return {} });
    this.client.extendEvent('purchases', { key: 456 });

    expect().isObject(this.client.extensions.collections['pageviews'][0]);
    expect().equal(this.client.extensions.collections['pageviews'][0].key, 123);
    expect().isFunction(this.client.extensions.collections['pageviews'][1]);
    expect().isObject(this.client.extensions.collections['pageviews'][2]);
    expect().equal(this.client.extensions.collections['pageviews'][2].key, 456);

    expect().isObject(this.client.extensions.collections['purchases'][0]);
    expect().equal(this.client.extensions.collections['purchases'][0].key, 123);
    expect().isFunction(this.client.extensions.collections['purchases'][1]);
    expect().isObject(this.client.extensions.collections['purchases'][2]);
    expect().equal(this.client.extensions.collections['purchases'][2].key, 456);
  });

  it('should emit an "extendEvent" event', () => {
    this.client.on('extendEvent', function(eventCollection, eventModifier){
      expect().equal(eventCollection, 'pageviews');
      expect().equal(eventModifier.key, 123);
    });
    this.client.extendEvent('pageviews', { key: 123 });
  });

  it('should emit an "extendEvents" event', () => {
    this.client.on('extendEvents', function(eventsModifier){
      expect().equal(eventsModifier.key, 123);
    });
    this.client.extendEvents({ key: 123 });
  });


  describe('when calling .recordEvent', () => {

    it('should extend the event body of all events', () => {
      this.client.on('recordEvent', function(eventCollection, eventBody){
        expect().equal(eventCollection, 'test');
        expect().deepEqual(eventBody, { key: 123, exists: true, user: { id: '3434', active: false } });
      });
      this.client.extendEvents({ key: 123, user: { id: '3434' } });
      this.client.recordEvent('test', { exists: true, user: { active: false } });
    });

    it('should extend the event body of a specific collection', () => {
      this.client.on('recordEvent', function(eventCollection, eventBody){
        expect().equal(eventCollection, 'test');
        expect().deepEqual(eventBody, { key: 123, exists: true, user: { id: '3434', active: false } });
      });
      this.client.extendEvent('test', { key: 123, user: { id: '3434' } });
      this.client.recordEvent('test', { exists: true, user: { active: false } });
    });

  });

  describe('when calling .recordEvents', () => {

    it('should extend the event body of all events', () => {
      this.client.on('recordEvents', function(eventsHash){
        expect().deepEqual(eventsHash, {
          'test 1': [
            { key: 123, exists: true, user: { id: '424234', key: 0 } }
          ],
          'test 2': [
            { key: 123, exists: false, test: 'string', user: { id: '424234' } }
          ],
          'test 3': [
            { key: 456, user: { id: '424234' } },
            { key: 123, exists: true, user: { id: '424234' } }
          ]
        });
      });
      this.client.extendEvents({ key: 123, user: { id: '424234' } });
      this.client.recordEvents({
        'test 1': [ { exists: true, user: { key: 0 } } ],
        'test 2': [ { exists: false, test: 'string' } ],
        'test 3': [ { key: 456 }, { exists: true } ]
      });
    });

  });

});
