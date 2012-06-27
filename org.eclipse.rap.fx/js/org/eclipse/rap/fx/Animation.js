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
    try {
      var widgetColor = qx.util.ColorUtil.cssStringToRgb( widget.getBackgroundColor() );
    } catch( ex ) {
    }
    if( color && widgetColor ) {
      this._colorToColorFade( widget, color, widgetColor );
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
    } );
    animation.start();
  }

};

}());