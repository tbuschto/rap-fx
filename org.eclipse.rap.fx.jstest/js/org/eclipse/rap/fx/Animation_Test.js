/*******************************************************************************
 * Copyright (c) 2012 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
 
(function() {

var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
var Animation = org.eclipse.rap.fx.Animation;
var Processor = org.eclipse.rwt.protocol.Processor;
var ObjectManager = org.eclipse.rwt.protocol.ObjectManager;

var widget;

qx.Class.define( "org.eclipse.rap.fx.Animation_Test", {

  extend : qx.core.Object,

  members : {

    testAnimationShake : function() {
      widget.setLeft( 40 );
      Animation.shake( widget );
      TestUtil.flush();
      assertTrue( parseInt( widget._style.left ) == 40 );
      var animation = this._getAnimation();
      this._loop( animation, 0 );
      assertTrue( animation.isRunning() );
      assertIdentical( widget, animation.getRenderer( 0 ).getContext() );
      this._loop( animation, 0.4 );
      assertTrue( parseInt( widget._style.left ) != 40 );
      this._loop( animation, 1.1 );
      assertFalse( animation.isRunning() );
      assertTrue( parseInt( widget._style.left ) == 40 );
    },

    testAnimationColorToColorFade : function() {
      widget.setBackgroundColor( "#FF0000" );
      widget.setBackgroundGradient( null );
      Animation.colorFade( widget, [ 100, 50, 255 ] );
      TestUtil.flush();
      assertEquals( [ 255, 0, 0 ], this._getBackground( widget ) );
      var animation = this._getAnimation();
      this._loop( animation, 0 );
      assertTrue( animation.isRunning() );
      assertEquals( [ 100, 50, 255 ], this._getBackground( widget ) );
      this._loop( animation, 0.4 );
      assertEquals( [ 125, 42, 214 ], this._getBackground( widget ) );
      this._loop( animation, 1.1 );
      assertEquals( [ 255, 0, 0 ], this._getBackground( widget ) );
      assertFalse( animation.isRunning() );
    },

    setUp : function() {
      TestUtil.createShellByProtocol( "w2" );
      Processor.processOperation( {
        "target" : "w3",
        "action" : "create",
        "type" : "rwt.widgets.Button",
        "properties" : {
          "style" : [ "PUSH" ],
          "parent" : "w2"
        }
      } );
      TestUtil.flush();
      widget = ObjectManager.getObject( "w3" );
      widget.focus();
    },

    tearDown : function() {
      Processor.processOperation( {
        "target" : "w2",
        "action" : "destroy"
      } );
      Processor.processOperation( {
        "target" : "w3",
        "action" : "destroy"
      } );
      widget = null;
    },

    _getAnimation : function() {
      return org.eclipse.rwt.Animation._queue[ 0 ];
    },

    _loop : function( animation, pos ) {
      var dur = animation.getDuration();
      var time;
      if( animation.isRunning() ) {
        time = animation._startOn;
      } else {
        time = new Date().getTime();
      }
      animation._loop( time + dur * pos );
    },

    _getBackground : function( widget ) {
      var cssStr = TestUtil.getCssBackgroundColor( widget );
      return qx.util.ColorUtil.stringToRgb( cssStr );
    }

  }

} );

}());