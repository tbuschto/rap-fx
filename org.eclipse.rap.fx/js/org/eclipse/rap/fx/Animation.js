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
 
qx.Class.createNamespace( "org.eclipse.rap.fx", {} );

(function(){

var AnimationUntil = org.eclipse.rwt.AnimationUntil;

org.eclipse.rap.fx.Animation = {

  shake : function( widget ) {
    var animation = AnimationUntil._createAnimation( widget, 500, "linear" );
    var rendererX = AnimationUntil._createRenderer( animation, widget, "left" );
    var left = parseInt( widget.getLeft(), 10 );
    var rad = 10;
    var converter = function( pos ){
      var result = left + Math.round( Math.sin( 8 * Math.PI * pos ) * rad );
      return result;
    };
    var cancel = function() { animation.cancel(); };
    widget.addEventListener( "changeLeft", cancel );
    animation.addEventListener( "cancel", function() {
      widget.removeEventListener( "changeLeft", cancel );
    } );
    rendererX.setConverter( converter );
    animation.start();
  },

  colorFade : function( widget, color ) {
    if( widget instanceof qx.ui.core.Widget ) {
      var colorStr = widget.getBackgroundColor()
      var widgetColor = this._getBackground( widget );
      if( color && widgetColor ) {
        this._colorToColorFade( widget, color, widgetColor );
      }
    }
  },

  _colorToColorFade : function( widget, startColor, endColor ) {
    var animation = AnimationUntil._createAnimation( widget, 800, "easeIn" );
    var renderer = AnimationUntil._createRenderer( animation, widget, "backgroundColor" );
    renderer.setStartValue( startColor );
    renderer.setEndValue( endColor );
    var cancel = function() { animation.cancel(); };
    widget.addEventListener( "changeBackgroundColor", cancel );
    animation.addEventListener( "cancel", function() {
      widget.removeEventListener( "changeBackgroundColor", cancel );
      widget._applyBackgroundColor( widget.getBackgroundColor() );
    } );
    animation.start();
  },

  _getBackground : function( widget ) {
    var result = null;
    var target = widget;
    while( target && !result ) {
      if( !this._isTransparent( target ) ) {
        result = qx.util.ColorUtil.cssStringToRgb( target.getBackgroundColor() );
      }
      target = target.getParent();
    }
    return result;
  },

  _isTransparent : function( widget ) {
    return ( ( widget.getBackgroundColor() == null ) || ( widget.getBackgroundColor() === "transparent" ) );
  }

};

}());