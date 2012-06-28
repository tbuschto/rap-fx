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
import org.eclipse.swt.events.SelectionListener;
import org.eclipse.swt.graphics.RGB;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Table;
import org.eclipse.swt.widgets.TableItem;


@SuppressWarnings( "serial" )
public class Demo implements IEntryPoint {

  public int createUI() {
    Display display = new Display();
    Shell shell = new Shell( display );
    shell.setText( "RAP FX Examples" );
    createShellContents( shell );
    shell.setBounds( 20, 20, 500, 400 );
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
    parent.setLayout( new GridLayout( 4, false ) );
    GridData fullRow = new GridData();
    fullRow.horizontalSpan = 4;
    Button shake = new Button( parent, SWT.PUSH );
    shake.setText( "Shake!" );
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
    final Button blueFade = new Button( parent, SWT.PUSH );
    blueFade.setText( "Blue Fade" );
    blueFade.addSelectionListener( new SelectionAdapter() {
      public void widgetSelected( SelectionEvent e ) {
        Animation.colorFade( blueFade, new RGB( 90, 90, 255 ) );
      }
    } );
    final Button yellowFade = new Button( parent, SWT.PUSH );
    yellowFade.setText( "Yellow Fade" );
    final Table table = new Table( parent, SWT.FULL_SELECTION | SWT.BORDER );
    table.setLayoutData( new GridData( SWT.FILL, SWT.TOP, true, true, 4, 1 ) );
    fillTable( table );
    yellowFade.addSelectionListener( new SelectionAdapter() {
      public void widgetSelected( SelectionEvent e ) {
        changeTable( table );
      }
    } );
  }

  private void fillTable( Table table ) {
    for( int i = 0; i < 7; i++ ) {
      TableItem item = new TableItem( table, SWT.NONE );
      item.setText( "Data " + Math.random() * 10000 );
    }
  }

  private void changeTable( Table table ) {
    int items = table.getItemCount() - 1;
    for( int i = 0; i < 3; i++ ) {
      int itemNr = ( int )( items * Math.random() );
      TableItem item = table.getItem( itemNr );
      item.setText( "Data " + Math.random() * 10000 );
      Animation.colorFade( item, new RGB( 255, 255, 0 ) );
    }
  }

}
