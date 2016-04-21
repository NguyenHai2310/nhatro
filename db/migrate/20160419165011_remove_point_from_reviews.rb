class RemovePointFromReviews < ActiveRecord::Migration
  def change
    remove_column :reviews, :point, :boolean
  end
end
