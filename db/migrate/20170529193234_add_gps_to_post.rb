class AddGpsToPost < ActiveRecord::Migration[5.0]
  def change
    add_column :posts, :gps, :string
  end
end
