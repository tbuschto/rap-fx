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

    testAnimationShakeInterrupted : function() {
      widget.setLeft( 40 );
      Animation.shake( widget );
      TestUtil.flush();
      var animation = this._getAnimation();
      this._loop( animation, 0 );
      this._loop( animation, 0.4 );
      widget.setLeft( 50 );
      TestUtil.flush();
      assertFalse( animation.isRunning() );
      assertTrue( parseInt( widget._style.left ) == 50 );
    },

    testAnimationColorToColorFade : function() {
      widget.setBackgroundColor( "#FF0000" );
      widget.setBackgroundGradient( null );
      Animation.colorFade( widget, null, [ 100, 50, 255 ] );
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

    testAnimationColorToColorFadeInterruptedBySetColor : function() {
      widget.setBackgroundColor( "#FF0000" );
      widget.setBackgroundGradient( null );
      Animation.colorFade( widget, null, [ 100, 50, 255 ] );
      TestUtil.flush();
      var animation = this._getAnimation();

      this._loop( animation, 0 );
      this._loop( animation, 0.4 );
      widget.setBackgroundColor( "#00FF00" );

      assertFalse( animation.isRunning() );
      assertEquals( [ 0, 255, 0 ], this._getBackground( widget ) );
    },

    testAnimationColorToColorFadeInterruptedBySetGradient : function() {
      widget.setBackgroundColor( "#FF0000" );
      widget.setBackgroundGradient( null );
      Animation.colorFade( widget, null, [ 100, 50, 255 ] );
      TestUtil.flush();
      var animation = this._getAnimation();

      this._loop( animation, 0 );
      this._loop( animation, 0.4 );
      widget.setBackgroundGradient( [ [ 0, "#ff0000" ], [ 1, "#00ff00" ] ] );

      assertFalse( animation.isRunning() );
    },

    testAnimationColorToTransparentFade : function() {
      widget.setBackgroundColor( null );
      widget.setBackgroundGradient( null );
      qx.ui.core.ClientDocument.getInstance().setBackgroundColor( "#FF0000" );
      widget.getParent().setBackgroundColor( null );
      Animation.colorFade( widget, null, [ 100, 50, 255 ] );
      TestUtil.flush();
      assertEquals( null, this._getBackground( widget ) );
      var animation = this._getAnimation();
      this._loop( animation, 0 );
      this._loop( animation, 0.99 );
      assertEquals( [ 252, 1, 5 ], this._getBackground( widget ) );
      this._loop( animation, 1.1 );
      assertEquals( null, this._getBackground( widget ) );
      qx.ui.core.ClientDocument.getInstance().setBackgroundColor( null );
    },

    testGridItemFade : function() {
      var grid = this._createGridByProtocol();
      var item1 = this._createGridItemByProtocol( 0 );
      var item2 = this._createGridItemByProtocol( 1 );
      var item3 = this._createGridItemByProtocol( 2 );
      TestUtil.flush();
      var row = grid.getRowContainer().getChildren()[ 1 ];

      Animation.colorFade( grid, item2, [ 0, 255, 0 ] );
      TestUtil.flush();

      var animation = this._getAnimation();
      assertIdentical( row, animation.getRenderer( 0 ).getContext() );
      this._loop( animation, 0 );
      assertEquals( [ 0, 255, 0 ], this._getBackground( row ) );
      this._loop( animation, 1.1 );
      assertEquals( null, this._getBackground( row ) );
      grid.destroy();
    },

    testGridItemOutOfViewFade : function() {
      var grid = this._createGridByProtocol();
      for( var i = 0; i < 30; i++ ) {
        this._createGridItemByProtocol( i );
      }
      var item = this._createGridItemByProtocol( 30 );
      TestUtil.flush();

      Animation.colorFade( grid, item, [ 0, 255, 0 ] );
      TestUtil.flush();

      assertTrue( null == this._getAnimation() );
      grid.destroy();
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
      var result = null
      var cssStr = TestUtil.getCssBackgroundColor( widget );
      if( cssStr && cssStr != "transparent" ) {
        result = qx.util.ColorUtil.stringToRgb( cssStr );
      }
      return result;
    },

    _createGridByProtocol : function() {
      org.eclipse.rwt.protocol.Processor.processOperation( {
        "target" : "w4",
        "action" : "create",
        "type" : "rwt.widgets.Grid",
        "properties" : {
          "style" : [],
          "parent" : "w2",
          "appearance" : "tree",
          "selectionPadding" : [ 2, 4 ],
          "indentionWidth" : 16,
          "bounds" : [ 0, 0, 100, 100 ],
          "fullSelection" : true,
          "itemHeight" : 20,
          "columnCount" : 2,
          "backgroundColor" : "#ff0000",
          "itemMetrics" : [
            [ 0, 0, 50, 0, 20, 20, 20 ],
            [ 0, 50, 50, 50, 20, 70, 20 ]
          ]
        }
      } );
      return org.eclipse.rwt.protocol.ObjectManager.getObject( "w4" );
    },

    _createGridItemByProtocol : function( index ) {
      var id = "w" + ( index + 6 );
      org.eclipse.rwt.protocol.Processor.processOperation( {
        "target" : id,
        "action" : "create",
        "type" : "rwt.widgets.GridItem",
        "properties" : {
          "parent" : "w4",
          "index": index
        }
      } );
      return org.eclipse.rwt.protocol.ObjectManager.getObject( id );
    },


  }

} );

}());