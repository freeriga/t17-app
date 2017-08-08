class RenameUpdatesToPosts < ActiveRecord::Migration[5.0]
  def change
    rename_table :updates, :posts
    rename_column :comments, :update_id, :post_id
  end
end
