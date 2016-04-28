class Review < ActiveRecord::Base
  include RailsAdmin::Review

  belongs_to :user
  belongs_to :address
  has_many :comments, dependent: :destroy

  validates :content, presence: true
  validates :user, presence: true
  validates :address, presence: true
  # validates :point, presence: true

  mount_uploader :image, PhotoUploader

  paginates_per Settings.pagination.review.per_page
end
