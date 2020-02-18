package com.shayamsharmaclasses.classcast;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.provider.BaseColumns;

public final class ContentKeysDatabaseContract {

    private ContentKeysDatabaseContract(){}

    public static class KeyInfo implements BaseColumns{
        public static final String TABLE_NAME = "key_info";
        public static final String COLUMN_CONTENT_ID = "content_id";
        public static final String COLUMN_CONTENT_URL = "content_url";
        public static final String COLUMN_CONTENT_NAME = "content_name";
        public static final String COLUMN_KEY_SET = "key_set";
        public static final String COLUMN_DOWNLOAD_TIME = "download_time";

    }

    public static class KeyDbHelper extends SQLiteOpenHelper{

        public static final int DATABASE_VERSION = 1;
        public static final String DATABASE_NAME = "ContentKeys.db";

        private static final String CREATE_KEY_INFO_TABLE = "CREATE TABLE "+KeyInfo.TABLE_NAME+
                " ("+KeyInfo.COLUMN_CONTENT_URL+" TEXT PRIMARY KEY, "+
                KeyInfo.COLUMN_CONTENT_ID+" TEXT, "+
                KeyInfo.COLUMN_CONTENT_NAME+" TEXT, "+
                KeyInfo.COLUMN_KEY_SET+" TEXT, "+
                KeyInfo.COLUMN_DOWNLOAD_TIME+" DATETIME DEFAULT CURRENT_TIMESTAMP)";

        public KeyDbHelper(Context context){
            super(context, DATABASE_NAME, null, DATABASE_VERSION);
        }

        @Override
        public void onCreate(SQLiteDatabase db) {
            db.execSQL(CREATE_KEY_INFO_TABLE);
        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

        }

        public boolean insertKeys(String content_name, String content_id, String key_set,
                               String content_url){
            SQLiteDatabase db = this.getWritableDatabase();
            ContentValues values = new ContentValues();
            values.put(KeyInfo.COLUMN_CONTENT_URL, content_url);
            values.put(KeyInfo.COLUMN_CONTENT_ID, content_id);
            values.put(KeyInfo.COLUMN_CONTENT_NAME, content_name);
            values.put(KeyInfo.COLUMN_KEY_SET, key_set);

            long newRowId = db.insertWithOnConflict(KeyInfo.TABLE_NAME, null, values,
                    SQLiteDatabase.CONFLICT_REPLACE);

            return newRowId != -1;
        }

        public String getKeys(String content_url){
            SQLiteDatabase db = this.getReadableDatabase();
            String[] projection = {KeyInfo.COLUMN_KEY_SET};
            String selection = KeyInfo.COLUMN_CONTENT_URL+" = ?";
            String[] selectionArgs = {content_url};
            Cursor cursor = db.query(
                    KeyInfo.TABLE_NAME,
                    projection,
                    selection,
                    selectionArgs,
                    null,
                    null,
                    null
            );
            if(cursor.getCount() != 1){
                return null;
            }else{
                cursor.moveToNext();
                String key_set = cursor.getString(cursor.getColumnIndex(KeyInfo.COLUMN_KEY_SET));
                cursor.close();
                return  key_set;
            }
        }
    }
}
