'use strict';

define("todolist/tests/helpers/create-offline-ref", ["exports", "firebase"], function (_exports, _firebase) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = createOfflineRef;

  /**
   * Creates an offline firebase reference with optional initial data and url.
   *
   * Be sure to `stubfirebase()` and `unstubfirebase()` in your tests!
   *
   * @param  {!Object} [initialData]
   * @param  {string} [url]
   * @param  {string} [apiKey]
   * @return {!firebase.database.Reference}
   */
  function createOfflineRef(initialData, url = 'https://emberfire-tests-2c814.firebaseio.com', apiKey = 'AIzaSyC9-ndBb1WR05rRF1msVQDV6EBqB752m6o') {
    if (!_firebase.default._unStub) {
      throw new Error('Please use stubFirebase() before calling this method');
    }

    const config = {
      apiKey: apiKey,
      authDomain: 'emberfire-tests-2c814.firebaseapp.com',
      databaseURL: url,
      storageBucket: ''
    };
    let app;

    try {
      app = _firebase.default.app();
    } catch (e) {
      app = _firebase.default.initializeApp(config);
    }

    const ref = app.database().ref();
    app.database().goOffline(); // must be called after the ref is created

    if (initialData) {
      ref.set(initialData);
    }

    return ref;
  }
});
define("todolist/tests/helpers/destroy-firebase-apps", ["exports", "firebase"], function (_exports, _firebase) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = destroyFirebaseApps;
  const {
    run
  } = Ember;
  /**
   * Destroy all Firebase apps.
   */

  function destroyFirebaseApps() {
    const deletions = _firebase.default.apps.map(app => app.delete());

    Ember.RSVP.all(deletions).then(() => run(() => {// NOOP to delay run loop until the apps are destroyed
    }));
  }
});
define("todolist/tests/helpers/replace-app-ref", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = replaceAppRef;

  /**
   * Updates the supplied app adapter's Firebase reference.
   *
   * @param  {!Ember.Application} app
   * @param  {!firebase.database.Reference} ref
   * @param  {string} [model]  The model, if overriding a model specific adapter
   */
  function replaceAppRef(app, ref, model = 'application') {
    app.register('service:firebaseMock', ref, {
      instantiate: false,
      singleton: true
    });
    app.inject('adapter:firebase', 'firebase', 'service:firebaseMock');
    app.inject('adapter:' + model, 'firebase', 'service:firebaseMock');
  }
});
define("todolist/tests/helpers/replace-firebase-app-service", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = replaceFirebaseAppService;

  /**
   * Replaces the `firebaseApp` service with your own using injection overrides.
   *
   * This is usually not needed in test modules, where you can re-register over
   * existing names in the registry, but in acceptance tests, some registry/inject
   * magic is needed.
   *
   * @param  {!Ember.Application} app
   * @param  {!Object} newService
   */
  function replaceFirebaseAppService(app, newService) {
    app.register('service:firebaseAppMock', newService, {
      instantiate: false,
      singleton: true
    });
    app.inject('torii-provider:firebase', 'firebaseApp', 'service:firebaseAppMock');
    app.inject('torii-adapter:firebase', 'firebaseApp', 'service:firebaseAppMock');
  }
});
define("todolist/tests/helpers/stub-firebase", ["exports", "firebase"], function (_exports, _firebase) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = stubFirebase;

  /**
   * When a reference is in offline mode it will not call any callbacks
   * until it goes online and resyncs. The ref will have already
   * updated its internal cache with the changed values so we shortcut
   * the process and call the supplied callbacks immediately (asynchronously).
   */
  function stubFirebase() {
    // check for existing stubbing
    if (!_firebase.default._unStub) {
      var originalSet = _firebase.default.database.Reference.prototype.set;
      var originalUpdate = _firebase.default.database.Reference.prototype.update;
      var originalRemove = _firebase.default.database.Reference.prototype.remove;

      _firebase.default._unStub = function () {
        _firebase.default.database.Reference.prototype.set = originalSet;
        _firebase.default.database.Reference.prototype.update = originalUpdate;
        _firebase.default.database.Reference.prototype.remove = originalRemove;
      };

      _firebase.default.database.Reference.prototype.set = function (data, cb) {
        originalSet.call(this, data);

        if (typeof cb === 'function') {
          setTimeout(cb, 0);
        }
      };

      _firebase.default.database.Reference.prototype.update = function (data, cb) {
        originalUpdate.call(this, data);

        if (typeof cb === 'function') {
          setTimeout(cb, 0);
        }
      };

      _firebase.default.database.Reference.prototype.remove = function (cb) {
        originalRemove.call(this);

        if (typeof cb === 'function') {
          setTimeout(cb, 0);
        }
      };
    }
  }
});
define("todolist/tests/helpers/unstub-firebase", ["exports", "firebase"], function (_exports, _firebase) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = unstubFirebase;

  function unstubFirebase() {
    if (typeof _firebase.default._unStub === 'function') {
      _firebase.default._unStub();

      delete _firebase.default._unStub;
    }
  }
});
define("todolist/tests/integration/helpers/format-date-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Helper | format-date', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it renders', async function (assert) {
      this.set('inputValue', '1234');
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "o76SOcjR",
        "block": "{\"symbols\":[],\"statements\":[[1,[27,\"format-date\",[[23,[\"inputValue\"]]],null],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(this.element.textContent.trim(), '1234');
    });
  });
});
define("todolist/tests/integration/helpers/format-markdown-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Helper | format-markdown', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it renders', async function (assert) {
      this.set('inputValue', '1234');
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "WHfRC8ef",
        "block": "{\"symbols\":[],\"statements\":[[1,[27,\"format-markdown\",[[23,[\"inputValue\"]]],null],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(this.element.textContent.trim(), '1234');
    });
  });
});
define("todolist/tests/lint/app.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | app');
  QUnit.test('adapters/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass ESLint\n\n');
  });
  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });
  QUnit.test('controllers/todos.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/todos.js should pass ESLint\n\n5:18 - Don\'t use Ember\'s function prototype extensions (ember/no-function-prototype-extensions)\n14:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n15:18 - Use import { sort } from \'@ember/object/computed\'; instead of using Ember.computed.sort (ember/new-module-imports)\n15:18 - \'Ember\' is not defined. (no-undef)');
  });
  QUnit.test('controllers/todos/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/todos/edit.js should pass ESLint\n\n');
  });
  QUnit.test('controllers/todos/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/todos/new.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/format-date.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/format-date.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/format-markdown.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'helpers/format-markdown.js should pass ESLint\n\n4:10 - Use import { htmlSafe } from \'@ember/template\'; instead of using Ember.String.htmlSafe (ember/new-module-imports)\n4:10 - \'Ember\' is not defined. (no-undef)\n4:36 - \'showdown\' is not defined. (no-undef)');
  });
  QUnit.test('models/todo.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/todo.js should pass ESLint\n\n');
  });
  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });
  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });
  QUnit.test('routes/todos.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/todos.js should pass ESLint\n\n');
  });
  QUnit.test('routes/todos/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/todos/edit.js should pass ESLint\n\n');
  });
  QUnit.test('routes/todos/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/todos/new.js should pass ESLint\n\n');
  });
});
define("todolist/tests/lint/templates.template.lint-test", [], function () {
  "use strict";

  QUnit.module('TemplateLint');
  QUnit.test('todolist/templates/application.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'todolist/templates/application.hbs should pass TemplateLint.\n\ntodolist/templates/application.hbs\n  14:6  error  Incorrect indentation for `<div>` beginning at L14:C6. Expected `<div>` to be at an indentation of 4 but was found at 6.  block-indentation\n  15:10  error  Incorrect indentation for `{{outlet}}` beginning at L15:C10. Expected `{{outlet}}` to be at an indentation of 8 but was found at 10.  block-indentation\n');
  });
  QUnit.test('todolist/templates/index.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'todolist/templates/index.hbs should pass TemplateLint.\n\ntodolist/templates/index.hbs\n  4:4  error  Incorrect indentation for `{{#link-to}}` beginning at L4:C4. Expected `{{#link-to}}` to be at an indentation of 2 but was found at 4.  block-indentation\n  5:0  error  Incorrect indentation for `    Create Your First Todo\n` beginning at L5:C0. Expected `    Create Your First Todo\n` to be at an indentation of 6 but was found at 4.  block-indentation\n  4:15  error  you must use double quotes in templates  quotes\n  4:29  error  you must use double quotes in templates  quotes\n');
  });
  QUnit.test('todolist/templates/todos.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'todolist/templates/todos.hbs should pass TemplateLint.\n\ntodolist/templates/todos.hbs\n  16:32  error  Incorrect indentation of attribute \'type\' beginning at L16:C32. Expected \'type\' to be at L17:C26.  attribute-indentation\n  16:44  error  Incorrect indentation of attribute \'class\' beginning at L16:C44. Expected \'class\' to be at L18:C26.  attribute-indentation\n  16:65  error  Incorrect indentation of attribute \'value\' beginning at L16:C65. Expected \'value\' to be at L19:C26.  attribute-indentation\n  16:78  error  Incorrect indentation of attribute \'id\' beginning at L16:C78. Expected \'id\' to be at L20:C26.  attribute-indentation\n  16:90  error  Incorrect indentation of attribute \'placeholder\' beginning at L16:C90. Expected \'placeholder\' to be at L21:C26.  attribute-indentation\n  16:117  error  Incorrect indentation of close curly braces \'}}\' for the component \'{{input}}\' beginning at L16:C117. Expected \'{{input}}\' to be at L22:C24.  attribute-indentation\n  3:4  error  Incorrect indentation for `<div>` beginning at L3:C4. Expected `<div>` to be at an indentation of 2 but was found at 4.  block-indentation\n  10:4  error  Incorrect indentation for `<div>` beginning at L10:C4. Expected `<div>` to be at an indentation of 2 but was found at 4.  block-indentation\n  4:8  error  Incorrect indentation for `{{#link-to}}` beginning at L4:C8. Expected `{{#link-to}}` to be at an indentation of 6 but was found at 8.  block-indentation\n  7:8  error  Incorrect indentation for `<hr>` beginning at L7:C8. Expected `<hr>` to be at an indentation of 6 but was found at 8.  block-indentation\n  8:8  error  Incorrect indentation for `{{outlet}}` beginning at L8:C8. Expected `{{outlet}}` to be at an indentation of 6 but was found at 8.  block-indentation\n  5:0  error  Incorrect indentation for `            Create Todo\n` beginning at L5:C0. Expected `            Create Todo\n` to be at an indentation of 10 but was found at 12.  block-indentation\n  12:8  error  Incorrect indentation for `<div>` beginning at L12:C8. Expected `<div>` to be at an indentation of 6 but was found at 8.  block-indentation\n  22:8  error  Incorrect indentation for `<hr>` beginning at L22:C8. Expected `<hr>` to be at an indentation of 6 but was found at 8.  block-indentation\n  24:8  error  Incorrect indentation for `{{#if}}` beginning at L24:C8. Expected `{{#if}}` to be at an indentation of 6 but was found at 8.  block-indentation\n  13:12  error  Incorrect indentation for `<div>` beginning at L13:C12. Expected `<div>` to be at an indentation of 10 but was found at 12.  block-indentation\n  14:16  error  Incorrect indentation for `<form>` beginning at L14:C16. Expected `<form>` to be at an indentation of 14 but was found at 16.  block-indentation\n  15:20  error  Incorrect indentation for `<div>` beginning at L15:C20. Expected `<div>` to be at an indentation of 18 but was found at 20.  block-indentation\n  18:20  error  Incorrect indentation for `{{! <button type="submit" class="btn btn-default"> Search </button> }}` beginning at L18:C20. Expected `{{! <button type="submit" class="btn btn-default"> Search </button> }}` to be at an indentation of 18 but was found at 20.  block-indentation\n  16:24  error  Incorrect indentation for `{{input}}` beginning at L16:C24. Expected `{{input}}` to be at an indentation of 22 but was found at 24.  block-indentation\n  25:12  error  Incorrect indentation for `{{#each}}` beginning at L25:C12. Expected `{{#each}}` to be at an indentation of 10 but was found at 12.  block-indentation\n  39:12  error  Incorrect indentation for `{{#each}}` beginning at L39:C12. Expected `{{#each}}` to be at an indentation of 10 but was found at 12.  block-indentation\n  26:16  error  Incorrect indentation for `<div>` beginning at L26:C16. Expected `<div>` to be at an indentation of 14 but was found at 16.  block-indentation\n  36:16  error  Incorrect indentation for `<br>` beginning at L36:C16. Expected `<br>` to be at an indentation of 14 but was found at 16.  block-indentation\n  27:20  error  Incorrect indentation for `<h4>` beginning at L27:C20. Expected `<h4>` to be at an indentation of 18 but was found at 20.  block-indentation\n  33:20  error  Incorrect indentation for `{{format-markdown}}` beginning at L33:C20. Expected `{{format-markdown}}` to be at an indentation of 18 but was found at 20.  block-indentation\n  34:20  error  Incorrect indentation for `<p>` beginning at L34:C20. Expected `<p>` to be at an indentation of 18 but was found at 20.  block-indentation\n  32:29  error  Incorrect indentation for `h4` beginning at L27:C20. Expected `</h4>` ending at L32:C29 to be at an indentation of 20 but was found at 24.  block-indentation\n  28:24  error  Incorrect indentation for `{{#link-to}}` beginning at L28:C24. Expected `{{#link-to}}` to be at an indentation of 22 but was found at 24.  block-indentation\n  29:25  error  Incorrect indentation for `{{todo.title}}` beginning at L29:C25. Expected `{{todo.title}}` to be at an indentation of 26 but was found at 25.  block-indentation\n  40:16  error  Incorrect indentation for `<div>` beginning at L40:C16. Expected `<div>` to be at an indentation of 14 but was found at 16.  block-indentation\n  48:16  error  Incorrect indentation for `<br>` beginning at L48:C16. Expected `<br>` to be at an indentation of 14 but was found at 16.  block-indentation\n  41:20  error  Incorrect indentation for `<h4>` beginning at L41:C20. Expected `<h4>` to be at an indentation of 18 but was found at 20.  block-indentation\n  45:20  error  Incorrect indentation for `{{format-markdown}}` beginning at L45:C20. Expected `{{format-markdown}}` to be at an indentation of 18 but was found at 20.  block-indentation\n  46:20  error  Incorrect indentation for `<p>` beginning at L46:C20. Expected `<p>` to be at an indentation of 18 but was found at 20.  block-indentation\n  44:29  error  Incorrect indentation for `h4` beginning at L41:C20. Expected `</h4>` ending at L44:C29 to be at an indentation of 20 but was found at 24.  block-indentation\n  41:25  error  Incorrect indentation for `{{#link-to}}` beginning at L41:C25. Expected `{{#link-to}}` to be at an indentation of 22 but was found at 25.  block-indentation\n  43:32  error  Incorrect indentation for `link-to` beginning at L41:C25. Expected `{{/link-to}}` ending at L43:C32 to be at an indentation of 25 but was found at 20.  block-indentation\n  42:24  error  Incorrect indentation for `{{todo.title}}` beginning at L42:C24. Expected `{{todo.title}}` to be at an indentation of 27 but was found at 24.  block-indentation\n  4:19  error  you must use double quotes in templates  quotes\n  4:37  error  you must use double quotes in templates  quotes\n  28:35  error  you must use double quotes in templates  quotes\n  41:36  error  you must use double quotes in templates  quotes\n');
  });
  QUnit.test('todolist/templates/todos/edit.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'todolist/templates/todos/edit.hbs should pass TemplateLint.\n\ntodolist/templates/todos/edit.hbs\n  4:16  error  Incorrect indentation of attribute \'type\' beginning at L4:C16. Expected \'type\' to be at L5:C10.  attribute-indentation\n  4:28  error  Incorrect indentation of attribute \'class\' beginning at L4:C28. Expected \'class\' to be at L6:C10.  attribute-indentation\n  4:49  error  Incorrect indentation of attribute \'value\' beginning at L4:C49. Expected \'value\' to be at L7:C10.  attribute-indentation\n  4:69  error  Incorrect indentation of attribute \'placeholder\' beginning at L4:C69. Expected \'placeholder\' to be at L8:C10.  attribute-indentation\n  4:94  error  Incorrect indentation of close curly braces \'}}\' for the component \'{{input}}\' beginning at L4:C94. Expected \'{{input}}\' to be at L9:C8.  attribute-indentation\n  2:4  error  Incorrect indentation for `<div>` beginning at L2:C4. Expected `<div>` to be at an indentation of 2 but was found at 4.  block-indentation\n  6:4  error  Incorrect indentation for `<div>` beginning at L6:C4. Expected `<div>` to be at an indentation of 2 but was found at 4.  block-indentation\n  10:4  error  Incorrect indentation for `<div>` beginning at L10:C4. Expected `<div>` to be at an indentation of 2 but was found at 4.  block-indentation\n  15:4  error  Incorrect indentation for `<button>` beginning at L15:C4. Expected `<button>` to be at an indentation of 2 but was found at 4.  block-indentation\n  17:4  error  Incorrect indentation for `{{#link-to}}` beginning at L17:C4. Expected `{{#link-to}}` to be at an indentation of 2 but was found at 4.  block-indentation\n  21:4  error  Incorrect indentation for `<button>` beginning at L21:C4. Expected `<button>` to be at an indentation of 2 but was found at 4.  block-indentation\n  3:8  error  Incorrect indentation for `<lable>` beginning at L3:C8. Expected `<lable>` to be at an indentation of 6 but was found at 8.  block-indentation\n  4:8  error  Incorrect indentation for `{{input}}` beginning at L4:C8. Expected `{{input}}` to be at an indentation of 6 but was found at 8.  block-indentation\n  7:8  error  Incorrect indentation for `<lable>` beginning at L7:C8. Expected `<lable>` to be at an indentation of 6 but was found at 8.  block-indentation\n  8:8  error  Incorrect indentation for `{{input}}` beginning at L8:C8. Expected `{{input}}` to be at an indentation of 6 but was found at 8.  block-indentation\n  11:8  error  Incorrect indentation for `<lable>` beginning at L11:C8. Expected `<lable>` to be at an indentation of 6 but was found at 8.  block-indentation\n  12:8  error  Incorrect indentation for `{{textarea}}` beginning at L12:C8. Expected `{{textarea}}` to be at an indentation of 6 but was found at 8.  block-indentation\n  15:67  error  Incorrect indentation for `Edit\n    ` beginning at L15:C67. Expected `Edit\n    ` to be at an indentation of 6 but was found at 67.  block-indentation\n  18:0  error  Incorrect indentation for `        Close\n` beginning at L18:C0. Expected `        Close\n` to be at an indentation of 6 but was found at 8.  block-indentation\n  17:15  error  you must use double quotes in templates  quotes\n  21:51  error  you must use double quotes in templates  quotes\n  21:21  error  you must use double quotes in templates  quotes\n');
  });
  QUnit.test('todolist/templates/todos/new.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'todolist/templates/todos/new.hbs should pass TemplateLint.\n\ntodolist/templates/todos/new.hbs\n  2:4  error  Incorrect indentation for `<div>` beginning at L2:C4. Expected `<div>` to be at an indentation of 2 but was found at 4.  block-indentation\n  6:4  error  Incorrect indentation for `<div>` beginning at L6:C4. Expected `<div>` to be at an indentation of 2 but was found at 4.  block-indentation\n  10:4  error  Incorrect indentation for `<div>` beginning at L10:C4. Expected `<div>` to be at an indentation of 2 but was found at 4.  block-indentation\n  15:4  error  Incorrect indentation for `<button>` beginning at L15:C4. Expected `<button>` to be at an indentation of 2 but was found at 4.  block-indentation\n  17:4  error  Incorrect indentation for `{{#link-to}}` beginning at L17:C4. Expected `{{#link-to}}` to be at an indentation of 2 but was found at 4.  block-indentation\n  3:8  error  Incorrect indentation for `<lable>` beginning at L3:C8. Expected `<lable>` to be at an indentation of 6 but was found at 8.  block-indentation\n  4:8  error  Incorrect indentation for `{{input}}` beginning at L4:C8. Expected `{{input}}` to be at an indentation of 6 but was found at 8.  block-indentation\n  7:8  error  Incorrect indentation for `<lable>` beginning at L7:C8. Expected `<lable>` to be at an indentation of 6 but was found at 8.  block-indentation\n  8:8  error  Incorrect indentation for `{{input}}` beginning at L8:C8. Expected `{{input}}` to be at an indentation of 6 but was found at 8.  block-indentation\n  11:8  error  Incorrect indentation for `<lable>` beginning at L11:C8. Expected `<lable>` to be at an indentation of 6 but was found at 8.  block-indentation\n  12:8  error  Incorrect indentation for `{{textarea}}` beginning at L12:C8. Expected `{{textarea}}` to be at an indentation of 6 but was found at 8.  block-indentation\n  15:57  error  Incorrect indentation for `Submit\n    ` beginning at L15:C57. Expected `Submit\n    ` to be at an indentation of 6 but was found at 57.  block-indentation\n  18:0  error  Incorrect indentation for `        Close\n` beginning at L18:C0. Expected `        Close\n` to be at an indentation of 6 but was found at 8.  block-indentation\n  17:15  error  you must use double quotes in templates  quotes\n');
  });
});
define("todolist/tests/lint/tests.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | tests');
  QUnit.test('integration/helpers/format-date-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/format-date-test.js should pass ESLint\n\n');
  });
  QUnit.test('integration/helpers/format-markdown-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/format-markdown-test.js should pass ESLint\n\n');
  });
  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
  QUnit.test('unit/controllers/todos-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/todos-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/controllers/todos/edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/todos/edit-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/controllers/todos/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/todos/new-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/models/todo-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/todo-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/routes/todos-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/todos-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/routes/todos/edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/todos/edit-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/routes/todos/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/todos/new-test.js should pass ESLint\n\n');
  });
});
define("todolist/tests/test-helper", ["todolist/app", "todolist/config/environment", "@ember/test-helpers", "ember-qunit"], function (_app, _environment, _testHelpers, _emberQunit) {
  "use strict";

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _emberQunit.start)();
});
define("todolist/tests/unit/controllers/todos-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Controller | todos', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let controller = this.owner.lookup('controller:todos');
      assert.ok(controller);
    });
  });
});
define("todolist/tests/unit/controllers/todos/edit-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Controller | todos/edit', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let controller = this.owner.lookup('controller:todos/edit');
      assert.ok(controller);
    });
  });
});
define("todolist/tests/unit/controllers/todos/new-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Controller | todos/new', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let controller = this.owner.lookup('controller:todos/new');
      assert.ok(controller);
    });
  });
});
define("todolist/tests/unit/models/todo-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Model | todo', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let store = this.owner.lookup('service:store');
      let model = store.createRecord('todo', {});
      assert.ok(model);
    });
  });
});
define("todolist/tests/unit/routes/todos-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | todos', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:todos');
      assert.ok(route);
    });
  });
});
define("todolist/tests/unit/routes/todos/edit-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | todos/edit', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:todos/edit');
      assert.ok(route);
    });
  });
});
define("todolist/tests/unit/routes/todos/new-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | todos/new', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:todos/new');
      assert.ok(route);
    });
  });
});
define('todolist/config/environment', [], function() {
  var prefix = 'todolist';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('todolist/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
