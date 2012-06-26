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
 
org.eclipse.rap.fx.Animation = {

  shake : function( widget ) {
    var animation = org.eclipse.rwt.AnimationUntil._createAnimation( widget, 500, "linear" );
    var rendererX = org.eclipse.rwt.AnimationUntil._createRenderer( animation, widget, "left" );
    var left = parseInt( widget.getLeft(), 10 );
    var rad = 10;
    var converter = function( pos ){
      var result = left + Math.round( Math.sin( 8 * Math.PI * pos ) * rad );
      return result;
    };
    rendererX.setConverter( converter );
    animation.start();
  },

  _getWidget : function( arg ) {
    var result = arg;
    if( result instanceof org.eclipse.rap.clientscripting.WidgetProxy ) {
      var id = result.getData( org.eclipse.rap.clientscripting.WidgetProxy._ID );
      result = org.eclipse.rwt.protocol.ObjectManager.getObject( id );
    }
    return result;
  }

};