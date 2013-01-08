/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.gbarboza.tbr;

import android.os.Bundle;
import android.view.Menu;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.view.LayoutInflater;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.app.Activity;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;

import org.apache.cordova.*;

public class tbr extends DroidGap {
	final Context context = this;
	private String targetURL = "";
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
    	MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.layout.my_menu, menu);
        return true;
    }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle item selection
        switch (item.getItemId()) {
            case R.id.bookmark:
            	doIt();
            	return true;
            case R.id.refresh:
            	super.appView.clearCache(false);
            	super.loadUrl("http://WEBSITE");
    			return true;
            case R.id.loadsite:
            	LayoutInflater li = LayoutInflater.from(context);
				View promptsView = li.inflate(R.layout.poop, null);
				AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(
						context);
				// set prompts.xml to alertdialog builder
				alertDialogBuilder.setView(promptsView);
				final EditText userInput = (EditText) promptsView
						.findViewById(R.id.editTextDialogUserInput);
				// set dialog message
				alertDialogBuilder
					.setCancelable(false)
					.setPositiveButton("OK",
					  new DialogInterface.OnClickListener() {
					    public void onClick(DialogInterface dialog,int id) {
					    	test(userInput.getText().toString());
					    }
					  })
					.setNegativeButton("Cancel",
					  new DialogInterface.OnClickListener() {
					    public void onClick(DialogInterface dialog,int id) {
						dialog.cancel();
					    }
					  });
				// create alert dialog
				AlertDialog alertDialog = alertDialogBuilder.create();
				// show it
				alertDialog.show();
            default:
                return super.onOptionsItemSelected(item);
        }
    }

	private void doIt() {
		String i_never_wanted_to_write_java_again = "javascript:(function doit1979() {    var d = document;    var u = d.location.href;    var svr = 'WEBSITE';    try {        if (!d.body) {            throw (0);        } else {            var j = d.createElement('script');            j.type = 'text/javascript';            j.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js';            j.id = '237jq';            var k = d.createElement('script');            k.type = 'text/javascript';            k.src = document.location.protocol + '//' + svr + '/js/jquery.foundation.reveal.js';            k.id = '237rv';            var n = d.createElement('script');            n.type = 'text/javascript';            n.src = document.location.protocol + '//' + svr + '/bmui';            n.id = '237js';            d.body.appendChild(j);            d.body.appendChild(k);            d.body.appendChild(n);        }    } catch (e) {        alert('Yo dawg, slow down. The page is not loaded yet');    }})();";
		super.loadUrl(i_never_wanted_to_write_java_again);
		return;
	}
	
	private void test(String url) {
		if(url.substring(0,6) != "http://") {
			super.loadUrl("http://" + url);
		} else {
			super.loadUrl(url);
		}
		
	}
}
