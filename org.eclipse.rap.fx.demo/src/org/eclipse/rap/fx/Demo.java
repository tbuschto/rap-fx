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

import org.eclipse.rwt.lifecycle.IEntryPoint;
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.MouseEvent;
import org.eclipse.swt.events.MouseListener;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.graphics.RGB;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Shell;


@SuppressWarnings( "serial" )
public class Demo implements IEntryPoint {

  public int createUI() {
    Display display = new Display();
    Shell shell = new Shell( display );
    shell.setText( "RAP FX Examples" );
    createShellContents( shell );
    shell.setBounds( 20, 20, 400, 500 );
    shell.open();
    while( !shell.isDisposed() ) {
      if( !display.readAndDispatch() ) {
        display.sleep();
      }
    }
    display.dispose();
    return 0;
  }

  private void createShellContents( final Composite parent ) {
    parent.setLayout( new GridLayout( 2, false ) );
    Button shake = new Button( parent, SWT.PUSH );
    shake.setText( "Shake!" );
    GridData fullRow = new GridData();
    fullRow.horizontalSpan = 2;
    shake.setLayoutData( fullRow );
    shake.addSelectionListener( new SelectionAdapter() {
      public void widgetSelected( SelectionEvent e ) {
        Animation.shake( parent.getShell() );
      }
    } );
    final Label redFade = new Label( parent, SWT.BORDER );
    redFade.setText( "Red Fade" );
    redFade.setCursor( redFade.getDisplay().getSystemCursor( SWT.CURSOR_HAND ) );
    redFade.setBackground( redFade.getDisplay().getSystemColor( SWT.COLOR_GREEN ) );
    redFade.addMouseListener( new MouseListener() {
      public void mouseUp( MouseEvent e ) { }
      public void mouseDown( MouseEvent e ) {
       Animation.colorFade( redFade, new RGB( 255, 90, 90 ) );
      }
      public void mouseDoubleClick( MouseEvent e ) { }
    } );
    final Label greenFade = new Label( parent, SWT.BORDER );
    greenFade.setText( "Green Fade" );
    greenFade.setCursor( greenFade.getDisplay().getSystemCursor( SWT.CURSOR_HAND ) );
    greenFade.addMouseListener( new MouseListener() {
      public void mouseUp( MouseEvent e ) { }
      public void mouseDown( MouseEvent e ) {
        Animation.colorFade( greenFade, new RGB( 90, 255, 90 ) );
      }
      public void mouseDoubleClick( MouseEvent e ) { }
    } );
  }

}
