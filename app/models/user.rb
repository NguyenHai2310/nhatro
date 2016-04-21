class User < ActiveRecord::Base
  include RailsAdmin::User

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :omniauthable
  has_many :addresses, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :identities
  has_many :chats

  enum role: [:normal, :admin]

  mount_uploader :avatar, PhotoUploader

  PARAMS_ATTRIBUTES = [:name, :email, :password, :password_confirmation,
    :current_password, :avatar]

  def google_oauth2
    identities.where(provider: "google_oauth2").first
  end

  def google_oauth2_client
    unless @google_oauth2_client
      @google_oauth2_client = Google::APIClient
        .new application_name: "omniauth-google-oauth2"
      @google_oauth2_client.authorization
        .update_token!({access_token: google_oauth2.accesstoken,
        refresh_token: google_oauth2.refreshtoken})
    end
    @google_oauth2_client
  end

  def facebook
    identities.find_by provider: Settings.provider.facebook
  end

  def facebook_client
    @facebook_client ||= Facebook.client access_token: facebook.accesstoken
  end

  def twitter
    identities.find_by provider: Settings.provider.twitter
  end

  def twitter_client
    @twitter_client ||= Twitter.client access_token: twitter.accesstoken
  end

  def linkedin
    identities.find_by provider: Settings.provider.linkedin
  end

  def linkedin_client
    @linkdin_client ||= Linkedin.client access_token: linkedin.accesstoken
  end
end
