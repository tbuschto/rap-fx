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
package org.eclipse.rap.fx;

import org.eclipse.rwt.internal.widgets.JSExecutor;
import org.eclipse.rwt.lifecycle.WidgetUtil;
import org.eclipse.swt.graphics.RGB;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.Item;
import org.eclipse.swt.widgets.TableItem;
import org.eclipse.swt.widgets.TreeItem;
import org.eclipse.swt.widgets.Widget;

@SuppressWarnings("restriction")
public class Animation  {

  public static void shake( Control control ) {
    call( "org.eclipse.rap.fx.Animation.shake", new Object[]{ control } );
  }

  public static void colorFade( Widget widget, RGB color ) {
    Control target = null;
    Item item = null;
    if( widget instanceof Control ) {
      target = ( Control )widget;
    } else if( widget instanceof TreeItem ) {
      item = ( Item )widget;
      target = ( ( TreeItem )widget ).getParent();
    } else if( widget instanceof TableItem ) {
      item = ( Item )widget;
      target = ( ( TableItem )widget ).getParent();
    }
    call( "org.eclipse.rap.fx.Animation.colorFade", new Object[]{ target, item, color } );
  }

  private static void call( String function, Object[] args ) {
    // TODO [tb] : use protocol (how to best get reference?)
    String code = function + "( ";
    for( int i = 0; i < args.length; i++ ) {
      if( args[ i ] instanceof Widget ) {
        code += "org.eclipse.rwt.protocol.ObjectManager.getObject( \"";
        code += WidgetUtil.getId( ( Widget )args[ i ] );
        code += "\" )";
      } else if( args[ i ] instanceof RGB ) {
        RGB rgb = ( RGB )args[ i ];
        code += "[ " + rgb.red + ", " + rgb.green + ", " + rgb.blue + " ]";
      } else {
        code += "null";
      }
      if( i != args.length - 1 ) {
        code += ", ";
      }
    }
    code += " );";
    JSExecutor.executeJS( code );
  }

}
